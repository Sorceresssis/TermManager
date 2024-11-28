import { login } from '@/api/authApi';
import { LocalStorageKey } from '@/config/channel_key';
import LocalStorageUtil from '@/utils/LocalStorageUtil';
const loginForm = document.getElementById('loginForm');


if (loginForm) {
  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const username = (document.getElementById('username') as HTMLInputElement | null)?.value;
    const password = (document.getElementById('password') as HTMLInputElement | null)?.value;

    if (username === void 0 || password === void 0) {
      throw new Error('Username and password are required');
    }

    login(username, password).then(resp => {
      if (resp.success) {
        LocalStorageUtil.set(LocalStorageKey.JWT, resp.data);
        location.href = '/';
      } else {
        alert(resp.msg);
      }
    });
  });
}