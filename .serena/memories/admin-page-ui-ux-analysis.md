# KBuddy Admin Page UI/UX Design Guide

## 현재 UI/UX 분석 결과

### 1. 디자인 시스템 특징

#### 색상 전략

- **브랜드 컬러**: 보라색 계열 (#6952F9) - 젊고 모던한 이미지
- **일관된 State 표현**: default → hover → pressed 순차적 시각 피드백
- **명확한 Semantic**: brand(액션), danger(위험), success(성공) 직관적 의미 전달

#### 시각적 계층

- **Headline (28px)**: 페이지 제목, 주요 섹션
- **Title (22px, 18px)**: 카드 제목, 서브 섹션
- **Body (16px, 14px)**: 본문 텍스트, 설명
- **Label (12px)**: 입력 필드 레이블, 태그

#### 인터랙션 원칙

- **Focus State**: 2px ring + offset으로 명확한 포커스 표시 (접근성)
- **Disabled State**: bg-highlight-disabled + text-disabled (시각적 차별화)
- **Error State**: border-danger + ErrorOutlineIcon + 하단 메시지

### 2. 컴포넌트 UX 패턴

#### TextField

- **Clear Button**: 입력값 있을 때만 표시 (조건부 렌더링)
- **에러 표시**: 아이콘 + 텍스트 조합 (시각+텍스트 이중 표현)
- **Focus 상태**: border 2px로 두께 변경 (시각적 강조)

#### Button

- **3가지 Variant**: solid(주요 액션), outline(보조 액션), link(덜 중요)
- **Focus Ring**: 2px ring + 2px offset (키보드 사용자 배려)
- **Disabled**: 색상 desaturate + cursor 변경

#### 레이아웃

- **반응형 기준**: xs(360px), sm(600px) - 모바일 우선
- **간격 체계**: Tailwind spacing (4px 단위)
- **카드 디자인**: shadow-default + rounded-lg (8px)

### 3. 사용자 경험 원칙

#### 피드백 제공

- **즉각적 반응**: hover, pressed 상태 명확
- **에러 메시지**: 구체적 문구 (비밀번호는 8자 이상)
- **로딩 상태**: isLoading 플래그로 중복 제출 방지

#### 접근성 (a11y)

- **Label 필수**: 모든 input에 명시적 label 연결
- **Focus 관리**: focus ring 명확, tab 순서 논리적
- **키보드 탐색**: 모든 인터랙티브 요소 키보드 접근 가능

#### 일관성

- **패턴 재사용**: shared 컴포넌트 적극 활용
- **네이밍 통일**: handle 접두사, Props 접미사
- **에러 처리**: 통일된 구조 (icon + message)

---

## 관리자 페이지 UI/UX 권장사항

### 1. 레이아웃 구조

#### Desktop Layout (관리자는 Desktop 중심)

```
┌─────────────────────────────────────────┐
│ Header (Topbar)                         │ 64px
├────────┬────────────────────────────────┤
│        │                                │
│ Side   │ Main Content Area              │
│ bar    │                                │
│        │                                │
│ 240px  │                                │
│        │                                │
└────────┴────────────────────────────────┘
```

#### 컴포넌트 구조

```typescript
<AdminLayout>
  <AdminTopbar user={user} onLogout={handleLogout} />
  <div className="flex">
    <AdminSidebar activeMenu="users" />
    <main className="flex-1 p-6 bg-bg-medium">
      {children} {/* 각 관리 페이지 */}
    </main>
  </div>
</AdminLayout>
```

### 2. 컴포넌트 디자인

#### AdminTopbar

- **높이**: 64px (기존 Topbar 패턴 유지)
- **배경**: bg-white + shadow-default
- **요소**:
  - 왼쪽: 로고 + "관리자" 배지
  - 오른쪽: 알림 아이콘 + 프로필 드롭다운

```typescript
<div className="h-16 px-6 flex items-center justify-between bg-white shadow-default">
  <div className="flex items-center gap-3">
    <Logo />
    <span className="px-3 py-1 bg-bg-brand-weak text-text-brand-default
                     text-label-300-heavy rounded-full">
      관리자
    </span>
  </div>
  <div className="flex items-center gap-4">
    <AlarmIcon />
    <ProfileIcon />
  </div>
</div>
```

#### AdminSidebar

- **너비**: 240px (고정)
- **배경**: bg-white + border-weak2 (우측 border)
- **메뉴 구조**:
  - Dashboard
  - 사용자 관리
  - 게시글 관리
  - 댓글 관리
  - 신고 관리
  - 설정

```typescript
<aside className="w-60 h-screen bg-white border-r border-border-weak2">
  <nav className="p-4">
    {menuItems.map((item) => (
      <MenuItem
        key={item.id}
        active={activeMenu === item.id}
        icon={item.icon}
        label={item.label}
      />
    ))}
  </nav>
</aside>
```

#### MenuItem (active state)

```typescript
<button className={cn(
  'w-full px-4 py-3 flex items-center gap-3 rounded-lg',
  'text-body-200-medium transition-colors',
  active
    ? 'bg-bg-brand-weak text-text-brand-default'
    : 'text-text-default hover:bg-bg-highlight-hover'
)}>
  {icon}
  {label}
</button>
```

### 3. 데이터 테이블 디자인

#### Table 구조

```typescript
<div className="bg-white rounded-lg shadow-default overflow-hidden">
  <TableHeader />
  <TableBody>
    {data.map(row => <TableRow key={row.id} data={row} />)}
  </TableBody>
  <TablePagination />
</div>
```

#### TableHeader

- **배경**: bg-bg-medium
- **텍스트**: text-label-200-medium
- **높이**: 48px
- **정렬**: 체크박스(왼쪽) + 각 컬럼 + 액션(오른쪽)

```typescript
<thead className="bg-bg-medium border-b border-border-weak2">
  <tr>
    <th className="px-4 py-3 text-left">
      <Checkbox />
    </th>
    <th className="px-4 py-3 text-left text-label-200-medium text-text-weak">
      사용자 ID
    </th>
    <th>이메일</th>
    <th>가입일</th>
    <th>상태</th>
    <th>액션</th>
  </tr>
</thead>
```

#### TableRow

- **높이**: 56px
- **Hover**: bg-bg-highlight-hover
- **선택**: bg-bg-highlight-selected
- **Border**: border-b border-border-weak2

```typescript
<tr className={cn(
  'h-14 border-b border-border-weak2 transition-colors',
  'hover:bg-bg-highlight-hover',
  selected && 'bg-bg-highlight-selected'
)}>
  <td className="px-4 py-3"><Checkbox checked={selected} /></td>
  <td className="px-4 py-3 text-body-200-medium">{userId}</td>
  <td>{email}</td>
  <td className="text-text-weak">{formatDate(createdDate)}</td>
  <td><StatusBadge status={status} /></td>
  <td>
    <button className="text-text-brand-default hover:text-text-brand-hover">
      편집
    </button>
  </td>
</tr>
```

### 4. 상태 배지 (StatusBadge)

```typescript
const statusVariants = cva(
  'inline-flex items-center px-2 py-1 rounded text-label-300-heavy',
  {
    variants: {
      status: {
        active: 'bg-bg-success-weak text-text-success-default',
        inactive: 'bg-bg-highlight-disabled text-text-disabled',
        blocked: 'bg-bg-danger-weak text-text-danger-default',
        pending: 'bg-[#FFF4E5] text-[#F59E0B]', // 노란색 (pending)
      },
    },
  }
);

<span className={statusVariants({ status })}>
  {statusText}
</span>
```

### 5. 필터 및 검색

#### FilterBar

- **배경**: bg-white
- **높이**: 64px
- **요소**: 검색 입력 + 필터 버튼들 + 액션 버튼

```typescript
<div className="h-16 px-6 bg-white rounded-lg shadow-default
                flex items-center justify-between mb-4">
  <div className="flex items-center gap-3">
    <TextField
      id="search"
      label="검색"
      placeholder="사용자 ID, 이메일 검색"
      className="w-80"
    />
    <SelectBox
      options={statusOptions}
      placeholder="상태 필터"
    />
    <SelectBox
      options={dateOptions}
      placeholder="기간 필터"
    />
  </div>
  <div className="flex items-center gap-2">
    <Button variant="outline" color="secondary" size="medium">
      <FilterIcon />
      상세 필터
    </Button>
    <Button variant="solid" color="primary" size="medium">
      검색
    </Button>
  </div>
</div>
```

### 6. 모달 디자인

#### 확인 모달 (삭제, 차단 등)

```typescript
<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
  <div className="bg-white rounded-lg shadow-selected w-96 p-6">
    <div className="flex items-center gap-3 mb-4">
      <ErrorOutlineIcon className="text-text-danger-default" />
      <h3 className="text-title-200-heavy">사용자 차단</h3>
    </div>
    <p className="text-body-200-medium text-text-weak mb-6">
      정말 이 사용자를 차단하시겠습니까? 이 작업은 되돌릴 수 없습니다.
    </p>
    <div className="flex gap-2 justify-end">
      <Button variant="outline" color="secondary" onClick={onCancel}>
        취소
      </Button>
      <Button variant="solid" color="primary" onClick={onConfirm}>
        차단하기
      </Button>
    </div>
  </div>
</div>
```

### 7. 대시보드 카드

#### Stat Card (통계 카드)

```typescript
<div className="bg-white rounded-lg shadow-default p-6">
  <div className="flex items-center justify-between mb-4">
    <h4 className="text-label-200-medium text-text-weak">총 사용자</h4>
    <ProfileIcon className="text-text-brand-default" />
  </div>
  <p className="text-headline-100-heavy text-text-default mb-2">
    1,234
  </p>
  <div className="flex items-center gap-1">
    <UpArrow className="text-text-success-default" />
    <span className="text-label-300-medium text-text-success-default">
      +12.5%
    </span>
    <span className="text-label-300-light text-text-weak">
      지난 달 대비
    </span>
  </div>
</div>
```

### 8. 색상 팔레트 (관리자 전용 확장)

기존 브랜드 컬러 유지하되, 상태별 추가 색상:

```typescript
// tailwind.config.js 확장
colors: {
  admin: {
    warning: {
      default: '#F59E0B', // Amber 500
      weak: '#FFF4E5',    // Amber 50
    },
    info: {
      default: '#3B82F6', // Blue 500
      weak: '#EFF6FF',    // Blue 50
    }
  }
}
```

### 9. 반응형 고려사항

관리자 페이지는 Desktop 중심이지만, 태블릿 대응:

```typescript
// Tablet (< 1024px): Sidebar collapse
<aside className="lg:w-60 md:w-16 transition-all">
  {/* Icon만 표시 또는 햄버거 메뉴로 */}
</aside>

// Mobile (< 768px): Full-screen modal 형태 sidebar
<aside className={cn(
  'fixed inset-0 z-40 bg-white transform transition-transform',
  isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
)}>
  {/* Sidebar content */}
</aside>
```

---

## UX 체크리스트

### 기본 원칙

✅ **일관성**: 기존 디자인 시스템 토큰 100% 활용
✅ **접근성**: 키보드 탐색, focus ring, ARIA labels
✅ **피드백**: 모든 액션에 즉각적 시각 피드백
✅ **에러 처리**: 명확한 에러 메시지 + 복구 방법 안내
✅ **로딩 상태**: 스켈레톤 또는 스피너로 대기 상태 표시

### 관리자 특화

✅ **대량 작업**: 체크박스 선택 + 일괄 액션 버튼
✅ **필터/검색**: 복잡한 데이터 빠르게 찾기
✅ **정렬**: 컬럼 클릭으로 정렬 (오름차순/내림차순)
✅ **페이지네이션**: 10/25/50/100개씩 보기 옵션
✅ **확인 모달**: 위험한 작업(삭제, 차단)은 2단계 확인
✅ **권한 검증**: 액션 버튼 disabled/숨김 처리
✅ **감사 로그**: 중요 작업은 누가, 언제, 무엇을 기록

### 성능 고려

✅ **가상 스크롤**: 대량 데이터 테이블 성능 최적화
✅ **Lazy Load**: 이미지, 무거운 컴포넌트 지연 로딩
✅ **디바운스**: 검색 입력 300ms 디바운스
✅ **캐싱**: React Query로 서버 상태 캐싱
