export function KakaoRedirectPage() {
  const code = new URL(window.location.href).searchParams.get('code');
  console.log('code: ', code);
  return <div>dd</div>;
}
