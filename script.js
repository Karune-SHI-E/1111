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

        if (true) { // GitHub 查询
            const resp = await fetch('https://raw.githubusercontent.com/Karune-SHI-E/1111/master/passwords_local.json.gz');
            if (resp.ok) {
                const compressed = await resp.arrayBuffer();
                const decompressed = pako.inflate(new Uint8Array(compressed), { to: 'string' });
                const data = JSON.parse(decompressed);
                if (data[md5]) password = data[md5];
            }
        }

        // 自建服务器查询
        if (!password) {
            try {
                const resp2 = await fetch(`http://127.0.0.1:5000/query/${md5}?user_id=YOUR_ID`);
                if (resp2.ok) {
                    const j = await resp2.json();
                    if (j.password) password = j.password;
                }
            } catch {}
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
