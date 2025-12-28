# KBuddy Front-End Code Conventions & UI/UX Analysis

## 프로젝트 개요

- **프레임워크**: React 18.3 + TypeScript 5.6
- **빌드 도구**: Vite 6.0
- **스타일링**: Tailwind CSS 3.4
- **상태 관리**: Zustand + React Query + Context API
- **폼 관리**: React Hook Form + Zod
- **라우팅**: React Router DOM 7.1
- **테스팅**: Vitest + Testing Library
- **컴포넌트 개발**: Storybook 8.5

---

## 1. 파일 및 폴더 구조

### 디렉토리 구조

```
src/
├── api/              # Axios 설정 및 클라이언트
├── assets/           # 이미지, 폰트, 아이콘
├── components/       # React 컴포넌트
│   ├── shared/      # 공통 컴포넌트 (atoms/molecules)
│   ├── contexts/    # Context Provider
│   ├── routes/      # 라우트 가드
│   └── [feature]/   # 기능별 컴포넌트 (community, mypage, login, signup)
├── constants/        # 상수 정의
├── hooks/            # 커스텀 훅
│   └── [domain]/    # 도메인별 훅 (blog, qna)
├── pages/            # 페이지 컴포넌트
├── services/         # API 서비스 레이어
├── store/            # Zustand 스토어
├── types/            # TypeScript 타입 정의
├── utils/            # 유틸리티 함수
├── App.tsx           # 앱 루트 컴포넌트
└── main.tsx          # 엔트리 포인트
```

### 컴포넌트 폴더 패턴

각 컴포넌트는 독립된 폴더 구조:

```
components/shared/button/
├── Button.tsx           # 컴포넌트 구현
├── Button.test.tsx      # 테스트
├── Button.stories.tsx   # Storybook
└── index.ts             # Named export
```

---

## 2. 네이밍 컨벤션

### 파일명

- **컴포넌트**: `PascalCase.tsx` (Button.tsx, TextField.tsx)
- **페이지**: `PascalCase.tsx` + Page 접미사 (HomePage.tsx, LoginPage.tsx)
- **훅**: `camelCase.ts` + use 접두사 (useLogin.ts, useContentActions.ts)
- **서비스**: `camelCase.ts` + Service 접미사 (authService.ts, blogService.ts)
- **타입**: `camelCase.ts` (user.ts, community.ts)
- **유틸**: `camelCase.ts` (utils.ts, date.ts)
- **상수**: `camelCase.ts` (enum.ts, nationalities.ts)

### 변수 및 함수명

- **컴포넌트**: PascalCase
- **함수/변수**: camelCase
- **상수**: UPPER_SNAKE_CASE (추정)
- **타입/인터페이스**: PascalCase
- **Props 인터페이스**: ComponentName + Props (ButtonProps, TextFieldProps)

### 이벤트 핸들러

- `handle` 접두사 사용: `handleClick`, `handleSubmit`, `handleChange`

---

## 3. TypeScript 패턴

### 타입 정의

```typescript
// Interface 사용 (Props, FormData)
export interface ButtonProps extends Omit<ComponentProps<'button'>, 'color'>, VariantProps<typeof buttonVariants> {
  type?: 'button' | 'submit' | 'reset';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}

// 네이티브 HTML 속성 상속
interface TextFieldProps extends ComponentProps<'input'> {
  id: string;
  label: string;
  error?: string;
}
```

### forwardRef 패턴

```typescript
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, color, size, variant, ...props }, ref) => {
    return <button ref={ref} {...props} />;
  }
);

Button.displayName = 'Button'; // displayName 명시
```

### 타입 export

```typescript
// types/index.ts - 중앙 export
export * from './community';
export * from './user';
export * from './post';
```

---

## 4. 디자인 시스템 (Tailwind 기반)

### Color Token 체계

#### Semantic Color System

```
text-{semantic}-{variant}
bg-{semantic}-{variant}
border-{semantic}-{variant}
```

**Semantic Categories**:

- `brand`: 주요 액션 (#6952F9 보라색 계열)
- `danger`: 위험/에러 (#D31510 빨강 계열)
- `success`: 성공 (#007A4D 초록 계열)
- `link`: 링크 (#0265DC 파랑 계열)
- `inverted`: 반전 (흰색/회색)

**State Variants**:

- `default`: 기본 상태
- `hover`: 호버 상태
- `pressed`: 눌림 상태
- `disabled`: 비활성 상태
- `weak` / `weakDown`: 약한 톤
- `strong`: 강한 톤

#### 예시

```typescript
// Brand colors
text-brand-default       // #6952F9
text-brand-hover         // #5A44D7
text-brand-pressed       // #4937B3
bg-brand-default         // #6952F9
bg-brand-weakDown        // #E2DEFD

// Danger colors
text-danger-default      // #D31510
border-danger-hover      // #B40000

// Neutral colors
text-default             // #222222
text-weak                // #6D6D6D
border-weak1             // #D5D5D5
```

### Typography System

#### 계층 구조

```
headline (28px) > title (22px, 18px) > body (16px, 14px) > button (16px, 14px, 12px) > label (16px, 14px, 12px)
```

#### 클래스 패턴

```
{category}-{size}-{weight}
```

**예시**:

```
headline-100-light    // 28px, light
title-200-heavy       // 18px, heavy
body-100-medium       // 16px, medium
button-200-regular    // 14px, regular
label-300-light       // 12px, light
```

#### Font Weight

- thin: 100
- extralight: 200
- light: 300
- normal: 400
- medium: 500
- semibold: 600
- bold: 700
- extrabold: 800
- black: 900

### Spacing & Layout

- **Font Family**: Roboto (sans-serif)
- **Rounded**: 8px border-radius 기본
- **Shadow**: default, hover, selected, gradientBg (4단계)
- **Breakpoints**: xs(360px), sm(600px)

---

## 5. 컴포넌트 패턴

### Variant System (CVA)

```typescript
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/utils';

const buttonVariants = cva(
  'base-classes', // 기본 클래스
  {
    variants: {
      variant: { solid: '...', outline: '...', link: '...' },
      color: { primary: '...', secondary: '...' },
      size: { small: '...', medium: '...', large: '...' },
    },
    compoundVariants: [{ variant: 'solid', color: 'primary', class: '...' }],
    defaultVariants: {
      variant: 'solid',
      color: 'primary',
      size: 'large',
    },
  }
);
```

### className 병합

```typescript
import { cn } from '@/utils/utils'; // tailwind-merge wrapper

<button className={cn(buttonVariants({ variant, color, size }), className)} />
```

### Controlled Component

```typescript
interface TextFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}
```

---

## 6. 상태 관리

### Zustand (전역 상태)

```typescript
// store/useTabsStore.ts
export const useTabsStore = create((set) => ({
  activeTab: 'blog',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
```

### React Query (서버 상태)

```typescript
// hooks/blog/useBlog.ts
import { blogKeys } from './blogKeys';

export const useFeaturedBlogs = () => {
  return useQuery({
    queryKey: blogKeys.featured,
    queryFn: blogService.getFeaturedBlogs,
  });
};
```

**Query Keys 분리**:

```typescript
// hooks/blog/blogKeys.ts
export const blogKeys = {
  all: ['blogs'],
  featured: ['blogs', 'featured'],
  detail: (id: number) => ['blogs', 'detail', id],
};
```

### Context API

```typescript
// components/contexts/EmailVerifyContextProvider.tsx
const EmailVerifyContext = createContext<EmailVerifyContextType | undefined>(undefined);

export const EmailVerifyContextProvider = ({ children }) => {
  const [state, setState] = useState(initialState);
  return (
    <EmailVerifyContext.Provider value={{ state, setState }}>
      {children}
    </EmailVerifyContext.Provider>
  );
};
```

---

## 7. 폼 관리

### React Hook Form + Zod

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/utils/validationSchemas';

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
  defaultValues: { emailOrUserId: '', password: '' },
});
```

### Validation Schema

```typescript
// utils/validationSchemas.ts
import { z } from 'zod';

export const loginSchema = z.object({
  emailOrUserId: z.string().min(1, '이메일 또는 아이디를 입력해주세요'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
});
```

---

## 8. API 통신

### Axios 클라이언트

```typescript
// api/axiosConfig.ts
export const authClient = axios.create({
  baseURL: 'https://api.k-buddy.kr/kbuddy/v1',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export const apiClient = axios.create({
  baseURL: 'https://api.k-buddy.kr/kbuddy/v1',
  headers: { 'Content-Type': 'application/json' },
});
```

### 401 자동 갱신 (inflightRefresh 패턴)

```typescript
let inflightRefresh: Promise<string> | null = null;

const getFreshAccessToken = async (): Promise<string> => {
  if (!inflightRefresh) {
    inflightRefresh = authService
      .refreshAccessToken()
      .then(({ data }) => data.accessToken)
      .finally(() => {
        inflightRefresh = null;
      });
  }
  return inflightRefresh;
};
```

### 서비스 레이어

```typescript
// services/authService.ts
export const authService = {
  login: (data: LoginFormData) => authClient.post('/auth/login', data),
  getUserProfile: () => authClient.get('/users/me'),
  refreshAccessToken: () => authClient.post('/auth/accessToken'),
};
```

### 커스텀 훅

```typescript
// hooks/useLogin.ts
export const useLogin = () => {
  const [error, setError] = useState({ emailOrUserId: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const result = await authService.login(data);
      // success handling
    } catch (error: any) {
      setError({ emailOrUserId: errorMessage, password: errorMessage });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, error, isLoading };
};
```

---

## 9. 개발 환경 설정

### ESLint

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "off",
    "react-hooks/exhaustive-deps": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }
    ]
  }
}
```

### Prettier

```json
{
  "printWidth": 120,
  "tabWidth": 2,
  "useTabs": false,
  "singleQuote": true,
  "trailingComma": "es5"
}
```

### Husky + lint-staged

```json
{
  "lint-staged": {
    "**/*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "**/*.{css,scss,md}": ["prettier --write"]
  }
}
```

---

## 10. 테스팅

### Vitest 설정

```typescript
// src/test/setup.ts - 테스트 초기화 파일
// Component.test.tsx - 테스트 파일
```

### Testing Library

```typescript
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

test('renders button', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

---

## 11. 관리자 페이지 개발 권장 사항

### 파일 구조

```
src/components/admin/           # 관리자 전용 컴포넌트
src/pages/admin/                # 관리자 페이지
src/hooks/admin/                # 관리자 훅
src/services/adminService.ts    # 관리자 API 서비스
src/types/admin.ts              # 관리자 타입 정의
```

### 컴포넌트 재사용

- `components/shared/` 의 Button, TextField, Select 등 재사용
- 기존 디자인 시스템 토큰 활용 (text-brand-default, bg-brand-default)
- cva 패턴으로 variant 확장

### 권한 관리

- `components/routes/AuthGuard.tsx` 패턴 참고
- AdminGuard 컴포넌트 생성 권장
- User 타입의 roles 필드 활용

### 상태 관리

- React Query로 관리자 데이터 관리
- adminKeys.ts로 query key 분리
- Zustand로 관리자 UI 상태 (사이드바, 필터 등)

### 라우팅

```typescript
// App.tsx
<Route path="/admin/*" element={<AdminGuard><AdminLayout /></AdminGuard>}>
  <Route path="users" element={<UserManagementPage />} />
  <Route path="posts" element={<PostManagementPage />} />
</Route>
```

---

## 요약: 핵심 컨벤션 체크리스트

✅ **파일명**: PascalCase.tsx (컴포넌트), camelCase.ts (훅/서비스)
✅ **폴더 구조**: 각 컴포넌트는 독립 폴더 + index.ts
✅ **타입**: interface + PascalCase + Props 접미사
✅ **스타일**: Tailwind + cva + cn() 병합
✅ **색상**: semantic-variant 토큰 (text-brand-default)
✅ **타이포**: category-size-weight (body-100-medium)
✅ **상태**: Zustand (전역) + React Query (서버) + Context
✅ **폼**: react-hook-form + zod
✅ **API**: 서비스 레이어 + 커스텀 훅
✅ **포맷**: Prettier 120자 + singleQuote + 2 spaces
✅ **테스트**: Vitest + Testing Library
