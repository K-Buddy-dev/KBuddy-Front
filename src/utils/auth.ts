import { authClient } from '@/api/axiosConfig';

/**
 * 로그인 여부.
 *
 * 액세스 토큰은 메모리(axios 전역 헤더)에만 보관하므로 이 값이 곧 로그인 상태다.
 * 로그인 전용 API를 호출하기 전에 이 함수로 걸러 게스트가 불필요한 401을 만들지 않도록 한다.
 */
export const isLoggedIn = (): boolean => !!authClient.defaults.headers.common['Authorization'];
