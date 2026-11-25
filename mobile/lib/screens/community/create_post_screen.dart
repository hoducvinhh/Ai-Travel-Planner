import 'dart:io';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:travel_planner/config/colors.dart';
import 'package:travel_planner/config/radius.dart';
import 'package:travel_planner/config/spacing.dart';
import 'package:travel_planner/config/text_styles.dart';
import 'package:travel_planner/models/community_post.dart';
import 'package:travel_planner/providers/auth_provider.dart';
import 'package:travel_planner/providers/community_provider.dart';
import 'package:travel_planner/providers/trips_provider.dart';
import 'package:travel_planner/services/api_service.dart';

/// Create or Edit Community Post screen with Title, Tags, Trip Attachment, and Image Upload
class CreatePostScreen extends ConsumerStatefulWidget {
  final CommunityPost? existingPost;

  const CreatePostScreen({super.key, this.existingPost});

  @override
  ConsumerState<CreatePostScreen> createState() => _CreatePostScreenState();
}

class _CreatePostScreenState extends ConsumerState<CreatePostScreen> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _titleController;
  late final TextEditingController _contentController;
  late final TextEditingController _tagsController;
  final TextEditingController _imageUrlController = TextEditingController();

  final List<String> _imageUrls = [];
  String? _selectedTripId;
  bool _isUploading = false;
  bool _isSubmitting = false;

  bool get _isEditing => widget.existingPost != null;

  @override
  void initState() {
    super.initState();
    final post = widget.existingPost;
    _titleController = TextEditingController(text: post?.title ?? '');
    _contentController = TextEditingController(text: post?.content ?? '');
    _tagsController =
        TextEditingController(text: post?.tags.join(', ') ?? '');
    if (post != null) {
      _imageUrls.addAll(post.images);
      _selectedTripId = post.tripId;
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _contentController.dispose();
    _tagsController.dispose();
    _imageUrlController.dispose();
    super.dispose();
  }

  Future<void> _pickAndUploadImage(ImageSource source) async {
    try {
      final picker = ImagePicker();
      final picked = await picker.pickImage(
        source: source,
        imageQuality: 80,
        maxWidth: 1600,
      );
      if (picked == null) return;

      setState(() => _isUploading = true);
      final uploadedUrl = await ref
          .read(communityRepositoryProvider)
          .uploadImage(File(picked.path));
      if (uploadedUrl.isNotEmpty && mounted) {
        setState(() => _imageUrls.add(uploadedUrl));
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Tải ảnh thành công!')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Không thể tải ảnh lên: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isUploading = false);
    }
  }

  void _addExternalImageUrl() {
    final trimmed = _imageUrlController.text.trim();
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Vui lòng nhập URL hợp lệ (http:// hoặc https://)'),
        ),
      );
      return;
    }
    setState(() {
      _imageUrls.add(trimmed);
      _imageUrlController.clear();
    });
  }

  Future<void> _submitPost() async {
    if (!(_formKey.currentState?.validate() ?? false)) return;

    final user = ref.read(authProvider).maybeWhen(
          authenticated: (u) => u,
          orElse: () => null,
        );
    if (user == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Vui lòng đăng nhập để đăng bài!')),
      );
      return;
    }

    setState(() => _isSubmitting = true);
    try {
      final tags = _tagsController.text
          .split(',')
          .map((t) => t.trim())
          .where((t) => t.isNotEmpty)
          .toList();

      final repo = ref.read(communityRepositoryProvider);
      if (_isEditing) {
        final updated = await repo.updatePost(
          postId: widget.existingPost!.id,
          title: _titleController.text.trim(),
          content: _contentController.text.trim(),
          tags: tags,
          images: _imageUrls,
          tripId: _selectedTripId,
        );
        ref.read(communityFeedProvider.notifier).replacePost(updated);
      } else {
        final created = await repo.createPost(
          userId: user.id,
          title: _titleController.text.trim(),
          content: _contentController.text.trim(),
          tags: tags,
          images: _imageUrls,
          tripId: _selectedTripId,
        );
        ref.read(communityFeedProvider.notifier).prependPost(created);
      }

      if (mounted) {
        Navigator.of(context).pop(true);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              _isEditing
                  ? 'Đã cập nhật bài viết!'
                  : 'Đăng bài thành công lên diễn đàn!',
            ),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Lỗi lưu bài viết: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final tripsAsync = ref.watch(tripsProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(_isEditing ? 'Chỉnh sửa bài viết' : 'Đăng bài viết'),
        backgroundColor: AppColors.surface,
        foregroundColor: AppColors.textPrimary,
        elevation: 0,
        actions: [
          TextButton(
            onPressed: (_isSubmitting || _isUploading) ? null : _submitPost,
            child: _isSubmitting
                ? const SizedBox(
                    width: 18,
                    height: 18,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : Text(
                    _isEditing ? 'Lưu' : 'Đăng bài',
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
          ),
        ],
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(AppSpacing.md),
          children: [
            TextFormField(
              controller: _titleController,
              decoration: InputDecoration(
                labelText: 'Tiêu đề bài viết *',
                hintText: 'VD: Tìm 2 bạn phượt săn mây Đà Lạt 3N2Đ...',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(AppRadius.md),
                ),
              ),
              validator: (v) => (v == null || v.trim().isEmpty)
                  ? 'Vui lòng nhập tiêu đề'
                  : null,
            ),
            const SizedBox(height: AppSpacing.md),

            TextFormField(
              controller: _contentController,
              maxLines: 5,
              decoration: InputDecoration(
                labelText: 'Nội dung chia sẻ *',
                hintText: 'Chia sẻ kinh nghiệm, lịch trình dự kiến hoặc tìm bạn đồng hành...',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(AppRadius.md),
                ),
              ),
              validator: (v) => (v == null || v.trim().isEmpty)
                  ? 'Vui lòng nhập nội dung'
                  : null,
            ),
            const SizedBox(height: AppSpacing.md),

            // Attach Trip selector
            tripsAsync.maybeWhen(
              data: (trips) {
                if (trips.isEmpty) return const SizedBox.shrink();
                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Đính kèm lịch trình của bạn (Tùy chọn)',
                      style: AppTextStyles.labelMedium.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 6),
                    DropdownButtonFormField<String?>(
                      initialValue: trips.any((t) => t.id == _selectedTripId)
                          ? _selectedTripId
                          : null,
                      isExpanded: true,
                      decoration: InputDecoration(
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(AppRadius.md),
                        ),
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: AppSpacing.md,
                          vertical: 10,
                        ),
                      ),
                      items: [
                        const DropdownMenuItem<String?>(
                          value: null,
                          child: Text('-- Không đính kèm lịch trình --'),
                        ),
                        ...trips.map((t) {
                          String range = '';
                          try {
                            final f = DateFormat('dd/MM/yyyy');
                            range =
                                '${f.format(DateTime.parse(t.startDate))} - ${f.format(DateTime.parse(t.endDate))}';
                          } catch (_) {}
                          return DropdownMenuItem<String?>(
                            value: t.id,
                            child: Text(
                              '${t.destination} ($range)',
                              overflow: TextOverflow.ellipsis,
                            ),
                          );
                        }),
                      ],
                      onChanged: (val) => setState(() => _selectedTripId = val),
                    ),
                    const SizedBox(height: AppSpacing.md),
                  ],
                );
              },
              orElse: () => const SizedBox.shrink(),
            ),

            // Tags input
            TextFormField(
              controller: _tagsController,
              decoration: InputDecoration(
                labelText: 'Tags phân loại (phân cách bằng dấu phẩy)',
                hintText: 'Đà Lạt, Săn mây, Tìm bạn đồng hành',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(AppRadius.md),
                ),
              ),
            ),
            const SizedBox(height: AppSpacing.md),

            // Image Upload & URL Paste
            Text(
              'Hình ảnh bài viết',
              style: AppTextStyles.labelMedium.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: _isUploading
                        ? null
                        : () => _pickAndUploadImage(ImageSource.gallery),
                    icon: const Icon(LucideIcons.image, size: 16),
                    label: const Text('Thư viện'),
                  ),
                ),
                const SizedBox(width: AppSpacing.sm),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: _isUploading
                        ? null
                        : () => _pickAndUploadImage(ImageSource.camera),
                    icon: const Icon(LucideIcons.camera, size: 16),
                    label: const Text('Chụp ảnh'),
                  ),
                ),
              ],
            ),
            if (_isUploading)
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 8),
                child: LinearProgressIndicator(color: AppColors.primary),
              ),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _imageUrlController,
                    decoration: InputDecoration(
                      hintText: 'Hoặc dán link ảnh URL...',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(AppRadius.md),
                      ),
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: AppSpacing.md,
                        vertical: 10,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                OutlinedButton(
                  onPressed: _addExternalImageUrl,
                  child: const Text('Thêm'),
                ),
              ],
            ),

            if (_imageUrls.isNotEmpty) ...[
              const SizedBox(height: AppSpacing.md),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: _imageUrls.asMap().entries.map((entry) {
                  final idx = entry.key;
                  final url = ApiService.formatImageUrl(entry.value);
                  return Stack(
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(AppRadius.sm),
                        child: CachedNetworkImage(
                          imageUrl: url,
                          width: 80,
                          height: 80,
                          fit: BoxFit.cover,
                        ),
                      ),
                      Positioned(
                        top: 2,
                        right: 2,
                        child: GestureDetector(
                          onTap: () => setState(() => _imageUrls.removeAt(idx)),
                          child: Container(
                            padding: const EdgeInsets.all(4),
                            decoration: const BoxDecoration(
                              color: Colors.black54,
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(
                              LucideIcons.x,
                              size: 12,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ),
                    ],
                  );
                }).toList(),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
