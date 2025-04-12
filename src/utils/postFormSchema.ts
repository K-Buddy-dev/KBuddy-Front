import { z } from 'zod';

export const postFormSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요').max(100, '제목은 100자 이내로 입력해주세요'),
  description: z.string().min(1, '내용을 입력해주세요').max(5000, '내용은 5000자 이내로 입력해주세요'),
  type: z.enum(['blog', 'qna', '']).refine((val) => val !== '', {
    message: '게시글 유형을 선택해주세요',
  }),
  categoryId: z.array(z.number()).min(1, '최소 1개 이상의 카테고리를 선택해주세요'),
  file: z.array(z.any()).min(0).max(5, '최대 5개까지 파일을 첨부할 수 있습니다'),
});
