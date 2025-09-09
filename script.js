const MD5_REGEX = /^[a-fA-F0-9]{32}$/;
const queryBtn = document.getElementById('query-btn');
const md5Input = document.getElementById('md5-input');
const resultDiv = document.getElementById('result');

queryBtn.addEventListener('click', async () => {
    const md5 = md5Input.value.trim();
    if (!MD5_REGEX.test(md5)) {
        resultDiv.textContent = "❌ MD5格式不正确";
        return;
    }

    resultDiv.textContent = "🔍 查询中...";
    try {
        let password = null;

        // GitHub 查询（普通 JSON，不再 gzip）
        try {
            const resp = await fetch('https://raw.githubusercontent.com/Karune-SHI-E/1111/main/passwords_local.json');
            if (resp.ok) {
                const data = await resp.json();
                if (data[md5]) password = data[md5];
            }
        } catch (e) {
            console.warn("GitHub 查询失败:", e);
        }

        // 自建服务器查询（备用）
        if (!password) {
            try {
                const resp2 = await fetch(`http://127.0.0.1:5000/query/${md5}?user_id=YOUR_ID`);
                if (resp2.ok) {
                    const j = await resp2.json();
                    if (j.password) password = j.password;
                }
            } catch (e) {
                console.warn("自建服务器查询失败:", e);
            }
        }

        if (password) {
            resultDiv.textContent = `🔑 密码: ${password}`;
        } else {
            resultDiv.textContent = "❌ 未找到密码";
        }
    } catch (e) {
        console.error(e);
        resultDiv.textContent = "❌ 查询失败，请检查网络";
    }
});
