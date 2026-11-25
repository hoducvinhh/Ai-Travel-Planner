import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:travel_planner/config/colors.dart';
import 'package:travel_planner/config/radius.dart';
import 'package:travel_planner/config/spacing.dart';
import 'package:travel_planner/config/text_styles.dart';
import 'package:travel_planner/models/chat_message.dart';
import 'package:travel_planner/providers/auth_provider.dart';
import 'package:travel_planner/providers/chat_provider.dart';
import 'package:travel_planner/widgets/chat/message_bubble.dart';

const List<Map<String, String>> _suggestedPrompts = [
  {
    'badge': 'Lịch trình',
    'prompt': 'Gợi ý lịch trình 3 ngày 2 đêm tại Đà Lạt cho gia đình',
  },
  {
    'badge': 'Ẩm thực',
    'prompt': 'Top món đặc sản và quán ăn truyền thống không nên bỏ qua ở Hội An',
  },
  {
    'badge': 'Chi phí',
    'prompt': 'Dự toán chi phí du lịch tự túc Phú Quốc 4 ngày 3 đêm cho 2 người',
  },
  {
    'badge': 'Kinh nghiệm',
    'prompt': 'Nên đi Sa Pa mùa nào đẹp nhất và kinh nghiệm trekking săn mây an toàn',
  },
];

/// AI Q&A Chatbot Screen with Sessions Drawer, SSE Streaming, Citations & Knowledge Feedback
class ChatScreen extends ConsumerStatefulWidget {
  const ChatScreen({super.key});

  @override
  ConsumerState<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends ConsumerState<ChatScreen> {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  String _sessionSearchQuery = '';

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _sendMessage([String? overrideText]) {
    final message = (overrideText ?? _messageController.text).trim();
    if (message.isEmpty) return;

    ref.read(chatProvider.notifier).sendMessage(message);
    if (overrideText == null) _messageController.clear();

    Future.delayed(const Duration(milliseconds: 100), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  Future<void> _showRenameDialog(ChatSession session) async {
    final controller = TextEditingController(text: session.title);
    final result = await showDialog<String>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Đổi tên đoạn chat'),
        content: TextField(
          controller: controller,
          autofocus: true,
          decoration: const InputDecoration(hintText: 'Nhập tiêu đề mới...'),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Hủy'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(ctx, controller.text),
            child: const Text('Lưu'),
          ),
        ],
      ),
    );
    controller.dispose();
    if (result != null && result.trim().isNotEmpty) {
      await ref
          .read(chatProvider.notifier)
          .updateSessionTitle(session.id, result);
    }
  }

  Future<void> _showFeedbackDialog(
    String userQuestion,
    String botAnswer,
  ) async {
    String selectedReason = 'OUTDATED_PRICE';
    final noteController = TextEditingController();
    bool submitting = false;

    final reasons = [
      ('OUTDATED_PRICE', 'Giá vé đã đổi'),
      ('CLOSED', 'Tạm ngưng / Đóng'),
      ('INCORRECT_INFO', 'Thông tin chưa đúng'),
      ('OTHER', 'Lý do khác'),
    ];

    await showDialog<void>(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDialogState) => AlertDialog(
          title: const Row(
            children: [
              Icon(LucideIcons.flag, size: 18, color: AppColors.error),
              SizedBox(width: 8),
              Text('Góp Ý Thông Tin', style: TextStyle(fontSize: 16)),
            ],
          ),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Lý do báo cáo:',
                  style: AppTextStyles.labelMedium.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 6,
                  runSpacing: 6,
                  children: reasons.map((r) {
                    final active = selectedReason == r.$1;
                    return ChoiceChip(
                      label: Text(r.$2, style: const TextStyle(fontSize: 11)),
                      selected: active,
                      onSelected: (_) =>
                          setDialogState(() => selectedReason = r.$1),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: noteController,
                  maxLines: 3,
                  decoration: const InputDecoration(
                    labelText: 'Ghi chú chi tiết',
                    hintText: 'Ví dụ: Giá vé hiện nay đã thay đổi thành...',
                  ),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: submitting ? null : () => Navigator.pop(ctx),
              child: const Text('Hủy'),
            ),
            ElevatedButton(
              onPressed: submitting
                  ? null
                  : () async {
                      setDialogState(() => submitting = true);
                      try {
                        await ref.read(chatProvider.notifier).submitFeedback(
                              userQuestion: userQuestion,
                              botAnswer: botAnswer,
                              reason: selectedReason,
                              userNote: noteController.text,
                            );
                        if (ctx.mounted) Navigator.pop(ctx);
                        if (mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Đã gửi góp ý thành công!'),
                            ),
                          );
                        }
                      } catch (e) {
                        setDialogState(() => submitting = false);
                      }
                    },
              child: submitting
                  ? const SizedBox(
                      width: 14,
                      height: 14,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: Colors.white,
                      ),
                    )
                  : const Text('Gửi góp ý'),
            ),
          ],
        ),
      ),
    );
    noteController.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final chatState = ref.watch(chatProvider);
    final user = ref.watch(authProvider).maybeWhen(
          authenticated: (u) => u,
          orElse: () => null,
        );

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Cố Vấn Du Lịch AI'),
        centerTitle: true,
        backgroundColor: AppColors.surface,
        foregroundColor: AppColors.textPrimary,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.plus),
            onPressed: chatState.isStreaming
                ? null
                : () => ref.read(chatProvider.notifier).startNewChat(),
            tooltip: 'Đoạn chat mới',
          ),
        ],
      ),
      drawer: _buildSessionsDrawer(chatState, user?.email),
      body: Column(
        children: [
          Expanded(
            child: chatState.isLoadingHistory
                ? const Center(
                    child: CircularProgressIndicator(color: AppColors.primary),
                  )
                : chatState.messages.isEmpty
                    ? _buildEmptyState()
                    : ListView.builder(
                        controller: _scrollController,
                        padding: const EdgeInsets.all(AppSpacing.md),
                        itemCount: chatState.messages.length,
                        itemBuilder: (_, index) {
                          final msg = chatState.messages[index];
                          String prevUserQ = '';
                          if (!msg.isUser) {
                            for (var i = index - 1; i >= 0; i--) {
                              if (chatState.messages[i].isUser) {
                                prevUserQ = chatState.messages[i].content;
                                break;
                              }
                            }
                          }
                          return MessageBubble(
                            message: msg,
                            onReportFeedback: !msg.isUser
                                ? () => _showFeedbackDialog(
                                    prevUserQ, msg.content)
                                : null,
                          );
                        },
                      ),
          ),
          if (chatState.error != null)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.md,
                vertical: AppSpacing.xs,
              ),
              color: AppColors.error.withValues(alpha: 0.1),
              child: Row(
                children: [
                  const Icon(LucideIcons.circleAlert,
                      size: 16, color: AppColors.error),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      chatState.error!,
                      style: AppTextStyles.bodySmall
                          .copyWith(color: AppColors.error),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(LucideIcons.x, size: 15),
                    onPressed: () =>
                        ref.read(chatProvider.notifier).clearError(),
                  ),
                ],
              ),
            ),
          Container(
            padding: const EdgeInsets.all(AppSpacing.sm),
            decoration: const BoxDecoration(
              color: AppColors.surface,
              border: Border(top: BorderSide(color: AppColors.border)),
            ),
            child: SafeArea(
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _messageController,
                      onChanged: (_) => setState(() {}),
                      enabled: !chatState.isStreaming,
                      maxLines: 3,
                      minLines: 1,
                      decoration: InputDecoration(
                        hintText: 'Hỏi bất cứ điều gì về du lịch Việt Nam...',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(AppRadius.lg),
                        ),
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: AppSpacing.md,
                          vertical: 10,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: AppSpacing.xs),
                  CircleAvatar(
                    backgroundColor: chatState.isStreaming ||
                            _messageController.text.trim().isEmpty
                        ? AppColors.border
                        : AppColors.primary,
                    child: IconButton(
                      onPressed: chatState.isStreaming ||
                              _messageController.text.trim().isEmpty
                          ? null
                          : () => _sendMessage(),
                      icon: chatState.isStreaming
                          ? const SizedBox(
                              width: 16,
                              height: 16,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: Colors.white,
                              ),
                            )
                          : const Icon(
                              LucideIcons.send,
                              color: Colors.white,
                              size: 18,
                            ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSessionsDrawer(ChatState chatState, String? userEmail) {
    final filtered = chatState.sessions.where((s) {
      if (_sessionSearchQuery.isEmpty) return true;
      return s.title.toLowerCase().contains(_sessionSearchQuery.toLowerCase());
    }).toList();

    return Drawer(
      backgroundColor: AppColors.surface,
      child: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(AppSpacing.md),
              child: SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: () {
                    ref.read(chatProvider.notifier).startNewChat();
                    Navigator.pop(context);
                  },
                  icon: const Icon(LucideIcons.plus, size: 18),
                  label: const Text('Đoạn chat mới'),
                ),
              ),
            ),
            if (chatState.sessions.length > 5)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
                child: TextField(
                  decoration: const InputDecoration(
                    hintText: 'Tìm đoạn chat...',
                    prefixIcon: Icon(LucideIcons.search, size: 16),
                    isDense: true,
                  ),
                  onChanged: (v) => setState(() => _sessionSearchQuery = v),
                ),
              ),
            const SizedBox(height: AppSpacing.sm),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'LỊCH SỬ TRÒ CHUYỆN',
                    style: AppTextStyles.labelSmall.copyWith(
                      color: AppColors.textSecondary,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    '${chatState.sessions.length}',
                    style: AppTextStyles.labelSmall,
                  ),
                ],
              ),
            ),
            const Divider(),
            Expanded(
              child: chatState.isLoadingSessions && chatState.sessions.isEmpty
                  ? const Center(child: CircularProgressIndicator())
                  : filtered.isEmpty
                      ? Center(
                          child: Text(
                            'Chưa có đoạn chat nào',
                            style: AppTextStyles.bodySmall.copyWith(
                              color: AppColors.textSecondary,
                            ),
                          ),
                        )
                      : ListView.builder(
                          itemCount: filtered.length,
                          itemBuilder: (_, idx) {
                            final session = filtered[idx];
                            final active = session.id == chatState.sessionId;
                            return ListTile(
                              selected: active,
                              selectedTileColor:
                                  AppColors.primary.withValues(alpha: 0.08),
                              leading: const Icon(
                                LucideIcons.messageSquare,
                                size: 17,
                              ),
                              title: Text(
                                session.title,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: AppTextStyles.bodySmall.copyWith(
                                  fontWeight: active
                                      ? FontWeight.bold
                                      : FontWeight.normal,
                                ),
                              ),
                              trailing: PopupMenuButton<String>(
                                icon: const Icon(
                                  LucideIcons.moreVertical,
                                  size: 16,
                                ),
                                onSelected: (val) {
                                  if (val == 'rename') {
                                    _showRenameDialog(session);
                                  } else if (val == 'delete') {
                                    ref
                                        .read(chatProvider.notifier)
                                        .deleteSession(session.id);
                                  }
                                },
                                itemBuilder: (_) => const [
                                  PopupMenuItem(
                                    value: 'rename',
                                    child: Text('Đổi tên'),
                                  ),
                                  PopupMenuItem(
                                    value: 'delete',
                                    child: Text(
                                      'Xóa',
                                      style: TextStyle(color: AppColors.error),
                                    ),
                                  ),
                                ],
                              ),
                              onTap: () {
                                Navigator.pop(context);
                                ref
                                    .read(chatProvider.notifier)
                                    .selectSession(session.id);
                              },
                            );
                          },
                        ),
            ),
            Container(
              padding: const EdgeInsets.all(AppSpacing.md),
              decoration: const BoxDecoration(
                color: AppColors.background,
                border: Border(top: BorderSide(color: AppColors.border)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      userEmail ?? 'Chế độ khách',
                      style: AppTextStyles.bodySmall,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  Text(
                    userEmail != null ? 'Đã đồng bộ' : 'Lưu cục bộ',
                    style: AppTextStyles.labelSmall.copyWith(
                      color: AppColors.primary,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return ListView(
      padding: const EdgeInsets.all(AppSpacing.lg),
      children: [
        const SizedBox(height: AppSpacing.lg),
        Center(
          child: Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              color: AppColors.textPrimary,
              borderRadius: BorderRadius.circular(AppRadius.lg),
            ),
            child: const Icon(
              LucideIcons.sparkles,
              size: 28,
              color: Colors.white,
            ),
          ),
        ),
        const SizedBox(height: AppSpacing.md),
        Text(
          'Bạn muốn khám phá điều gì hôm nay?',
          style: AppTextStyles.headlineSmall.copyWith(
            fontWeight: FontWeight.bold,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 6),
        Text(
          'Hỏi đáp về lịch trình, ẩm thực, chi phí hoặc kinh nghiệm khám phá mọi miền Việt Nam.',
          style: AppTextStyles.bodySmall.copyWith(
            color: AppColors.textSecondary,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: AppSpacing.lg),
        ..._suggestedPrompts.map((item) {
          return Card(
            margin: const EdgeInsets.only(bottom: AppSpacing.sm),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(AppRadius.lg),
              side: const BorderSide(color: AppColors.border),
            ),
            elevation: 0,
            child: InkWell(
              onTap: () => _sendMessage(item['prompt']),
              borderRadius: BorderRadius.circular(AppRadius.lg),
              child: Padding(
                padding: const EdgeInsets.all(AppSpacing.md),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 2,
                          ),
                          decoration: BoxDecoration(
                            color: AppColors.primary.withValues(alpha: 0.12),
                            borderRadius: BorderRadius.circular(AppRadius.full),
                          ),
                          child: Text(
                            item['badge']!,
                            style: AppTextStyles.labelSmall.copyWith(
                              color: AppColors.primary,
                              fontWeight: FontWeight.bold,
                              fontSize: 10,
                            ),
                          ),
                        ),
                        const Icon(
                          LucideIcons.arrowUpRight,
                          size: 16,
                          color: AppColors.textSecondary,
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(
                      item['prompt']!,
                      style: AppTextStyles.bodyMedium.copyWith(
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        }),
      ],
    );
  }
}
