import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:travel_planner/config/colors.dart';
import 'package:travel_planner/config/radius.dart';
import 'package:travel_planner/config/spacing.dart';
import 'package:travel_planner/config/text_styles.dart';
import 'package:travel_planner/providers/auth_provider.dart';
import 'package:travel_planner/providers/messages_provider.dart';
import 'package:travel_planner/widgets/common/loading_indicator.dart';

/// Active 1-1 Direct Chat room screen (Socket.IO real-time)
class DirectChatScreen extends ConsumerStatefulWidget {
  final String conversationId;
  final String? seedMessage;

  const DirectChatScreen({
    super.key,
    required this.conversationId,
    this.seedMessage,
  });

  @override
  ConsumerState<DirectChatScreen> createState() => _DirectChatScreenState();
}

class _DirectChatScreenState extends ConsumerState<DirectChatScreen> {
  late final TextEditingController _inputController;
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _inputController = TextEditingController(text: widget.seedMessage ?? '');
  }

  @override
  void dispose() {
    _inputController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _send() {
    final text = _inputController.text.trim();
    if (text.isEmpty) return;
    ref
        .read(directChatProvider(widget.conversationId).notifier)
        .sendMessage(text);
    _inputController.clear();
    Future.delayed(const Duration(milliseconds: 80), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 250),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final chatState = ref.watch(directChatProvider(widget.conversationId));
    final currentUserId = ref.watch(authProvider).maybeWhen(
          authenticated: (u) => u.id,
          orElse: () => null,
        );

    final partner = chatState.partner;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        foregroundColor: AppColors.textPrimary,
        elevation: 0,
        title: Row(
          children: [
            CircleAvatar(
              radius: 17,
              backgroundColor: AppColors.primary.withValues(alpha: 0.12),
              child: Text(
                (partner?.displayName ?? 'U')[0].toUpperCase(),
                style: AppTextStyles.labelLarge.copyWith(
                  color: AppColors.primary,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const SizedBox(width: AppSpacing.sm),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    partner?.displayName ?? 'Đang tải...',
                    style: AppTextStyles.labelLarge.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  Text(
                    chatState.partnerTyping ? 'Đang soạn tin nhắn...' : 'Trực tuyến',
                    style: AppTextStyles.bodySmall.copyWith(
                      color: AppColors.success,
                      fontSize: 11,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      body: Column(
        children: [
          const Divider(height: 1),
          Expanded(
            child: chatState.isLoading
                ? const LoadingIndicator()
                : chatState.messages.isEmpty
                    ? Center(
                        child: Padding(
                          padding: const EdgeInsets.all(AppSpacing.xl),
                          child: Text(
                            'Hãy gửi lời chào đầu tiên để làm quen hoặc bàn về lịch trình đồng hành!',
                            textAlign: TextAlign.center,
                            style: AppTextStyles.bodyMedium.copyWith(
                              color: AppColors.textSecondary,
                            ),
                          ),
                        ),
                      )
                    : ListView.builder(
                        controller: _scrollController,
                        padding: const EdgeInsets.all(AppSpacing.md),
                        itemCount: chatState.messages.length,
                        itemBuilder: (_, idx) {
                          final m = chatState.messages[idx];
                          final isMe = m.senderId == currentUserId;
                          return Align(
                            alignment: isMe
                                ? Alignment.centerRight
                                : Alignment.centerLeft,
                            child: Container(
                              margin: const EdgeInsets.only(bottom: 10),
                              constraints: BoxConstraints(
                                maxWidth:
                                    MediaQuery.of(context).size.width * 0.76,
                              ),
                              child: Column(
                                crossAxisAlignment: isMe
                                    ? CrossAxisAlignment.end
                                    : CrossAxisAlignment.start,
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 14,
                                      vertical: 10,
                                    ),
                                    decoration: BoxDecoration(
                                      color: isMe
                                          ? AppColors.primary
                                          : AppColors.surface,
                                      borderRadius:
                                          BorderRadius.circular(AppRadius.lg),
                                      border: isMe
                                          ? null
                                          : Border.all(color: AppColors.border),
                                    ),
                                    child: Text(
                                      m.content,
                                      style: AppTextStyles.bodyMedium.copyWith(
                                        color: isMe
                                            ? Colors.white
                                            : AppColors.textPrimary,
                                      ),
                                    ),
                                  ),
                                  const SizedBox(height: 3),
                                  Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Text(
                                        _formatClock(m.createdAt),
                                        style: AppTextStyles.bodySmall.copyWith(
                                          fontSize: 10,
                                          color: AppColors.textTertiary,
                                        ),
                                      ),
                                      if (isMe) ...[
                                        const SizedBox(width: 4),
                                        Icon(
                                          m.isRead
                                              ? LucideIcons.checkCheck
                                              : LucideIcons.check,
                                          size: 12,
                                          color: m.isRead
                                              ? AppColors.success
                                              : AppColors.textTertiary,
                                        ),
                                      ],
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
          ),
          SafeArea(
            child: Container(
              padding: const EdgeInsets.all(AppSpacing.sm),
              decoration: const BoxDecoration(
                color: AppColors.surface,
                border: Border(top: BorderSide(color: AppColors.border)),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _inputController,
                      onChanged: (val) => ref
                          .read(directChatProvider(widget.conversationId).notifier)
                          .onTypingChanged(val),
                      onSubmitted: (_) => _send(),
                      decoration: InputDecoration(
                        hintText: 'Nhập tin nhắn...',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(AppRadius.full),
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
                    backgroundColor: AppColors.primary,
                    child: IconButton(
                      onPressed: _send,
                      icon: const Icon(
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

  String _formatClock(String raw) {
    try {
      return DateFormat('HH:mm').format(DateTime.parse(raw).toLocal());
    } catch (_) {
      return '';
    }
  }
}
