function logout() {
    document.cookie =
        '_wab_auth_jwt' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.reload();
}
