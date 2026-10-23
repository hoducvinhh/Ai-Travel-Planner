import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

/// Database service for offline storage
class DatabaseService {
  static Database? _database;
  static const String _dbName = 'travel_planner.db';
  static const int _dbVersion = 1;

  /// Get database instance
  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDatabase();
    return _database!;
  }

  /// Initialize database
  Future<Database> _initDatabase() async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, _dbName);

    return await openDatabase(
      path,
      version: _dbVersion,
      onCreate: _onCreate,
      onUpgrade: _onUpgrade,
    );
  }

  /// Create tables
  Future<void> _onCreate(Database db, int version) async {
    // Trips table
    await db.execute('''
      CREATE TABLE trips (
        id TEXT PRIMARY KEY,
        destination TEXT NOT NULL,
        startDate TEXT NOT NULL,
        endDate TEXT NOT NULL,
        budget REAL NOT NULL,
        imageUrl TEXT,
        description TEXT,
        travelersCount INTEGER,
        preferences TEXT,
        syncStatus TEXT DEFAULT 'synced',
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    ''');

    // Places table
    await db.execute('''
      CREATE TABLE places (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        province TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        category TEXT,
        description TEXT,
        imageUrl TEXT,
        rating REAL DEFAULT 0.0,
        reviewCount INTEGER DEFAULT 0,
        budgetLevel TEXT,
        district TEXT,
        amenities TEXT,
        openingHours TEXT,
        phone TEXT,
        website TEXT,
        syncStatus TEXT DEFAULT 'synced',
        cachedAt TEXT NOT NULL
      )
    ''');

    // Trip places (many-to-many relationship)
    await db.execute('''
      CREATE TABLE trip_places (
        tripId TEXT NOT NULL,
        placeId TEXT NOT NULL,
        dayNumber INTEGER NOT NULL,
        orderIndex INTEGER NOT NULL,
        PRIMARY KEY (tripId, placeId),
        FOREIGN KEY (tripId) REFERENCES trips (id) ON DELETE CASCADE,
        FOREIGN KEY (placeId) REFERENCES places (id) ON DELETE CASCADE
      )
    ''');

    // Create indexes
    await db.execute('CREATE INDEX idx_trips_syncStatus ON trips(syncStatus)');
    await db.execute('CREATE INDEX idx_places_province ON places(province)');
    await db.execute('CREATE INDEX idx_places_category ON places(category)');
  }

  /// Upgrade database
  Future<void> _onUpgrade(Database db, int oldVersion, int newVersion) async {
    // Handle database migrations here
    if (oldVersion < 2) {
      // Example migration for version 2
      // await db.execute('ALTER TABLE trips ADD COLUMN newColumn TEXT');
    }
  }

  // Trips operations

  /// Cache trip
  Future<void> cacheTrip(Map<String, dynamic> trip) async {
    final db = await database;
    await db.insert(
      'trips',
      {
        ...trip,
        'preferences': trip['preferences'] != null
            ? (trip['preferences'] as List).join(',')
            : null,
        'syncStatus': 'synced',
        'createdAt': DateTime.now().toIso8601String(),
        'updatedAt': DateTime.now().toIso8601String(),
      },
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  /// Get all cached trips
  Future<List<Map<String, dynamic>>> getCachedTrips() async {
    final db = await database;
    final List<Map<String, dynamic>> trips = await db.query('trips');

    return trips.map((trip) {
      return {
        ...trip,
        'preferences': trip['preferences'] != null
            ? (trip['preferences'] as String).split(',')
            : [],
      };
    }).toList();
  }

  /// Get cached trip by ID
  Future<Map<String, dynamic>?> getCachedTrip(String id) async {
    final db = await database;
    final List<Map<String, dynamic>> trips = await db.query(
      'trips',
      where: 'id = ?',
      whereArgs: [id],
    );

    if (trips.isEmpty) return null;

    final trip = trips.first;
    return {
      ...trip,
      'preferences': trip['preferences'] != null
          ? (trip['preferences'] as String).split(',')
          : [],
    };
  }

  /// Delete cached trip
  Future<void> deleteCachedTrip(String id) async {
    final db = await database;
    await db.delete('trips', where: 'id = ?', whereArgs: [id]);
  }

  // Places operations

  /// Cache place
  Future<void> cachePlace(Map<String, dynamic> place) async {
    final db = await database;
    await db.insert(
      'places',
      {
        ...place,
        'amenities': place['amenities'] != null
            ? (place['amenities'] as List).join(',')
            : null,
        'syncStatus': 'synced',
        'cachedAt': DateTime.now().toIso8601String(),
      },
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  /// Get cached places
  Future<List<Map<String, dynamic>>> getCachedPlaces({
    String? province,
    String? category,
  }) async {
    final db = await database;

    String whereClause = '';
    List<dynamic> whereArgs = [];

    if (province != null) {
      whereClause = 'province = ?';
      whereArgs.add(province);
    }

    if (category != null) {
      if (whereClause.isNotEmpty) whereClause += ' AND ';
      whereClause += 'category = ?';
      whereArgs.add(category);
    }

    final List<Map<String, dynamic>> places = await db.query(
      'places',
      where: whereClause.isNotEmpty ? whereClause : null,
      whereArgs: whereArgs.isNotEmpty ? whereArgs : null,
    );

    return places.map((place) {
      return {
        ...place,
        'amenities': place['amenities'] != null
            ? (place['amenities'] as String).split(',')
            : [],
      };
    }).toList();
  }

  /// Get cached place by ID
  Future<Map<String, dynamic>?> getCachedPlace(String id) async {
    final db = await database;
    final List<Map<String, dynamic>> places = await db.query(
      'places',
      where: 'id = ?',
      whereArgs: [id],
    );

    if (places.isEmpty) return null;

    final place = places.first;
    return {
      ...place,
      'amenities': place['amenities'] != null
          ? (place['amenities'] as String).split(',')
          : [],
    };
  }

  /// Clear all cached data
  Future<void> clearCache() async {
    final db = await database;
    await db.delete('trips');
    await db.delete('places');
    await db.delete('trip_places');
  }

  /// Clear old cache (older than specified days)
  Future<void> clearOldCache(int days) async {
    final db = await database;
    final cutoffDate = DateTime.now().subtract(Duration(days: days));

    await db.delete(
      'places',
      where: 'cachedAt < ?',
      whereArgs: [cutoffDate.toIso8601String()],
    );
  }

  /// Close database
  Future<void> close() async {
    if (_database != null) {
      await _database!.close();
      _database = null;
    }
  }
}
