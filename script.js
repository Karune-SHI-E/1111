const MD5_REGEX = /^[a-fA-F0-9]{32}$/;
const queryBtn = document.getElementById('query-btn');
const md5Input = document.getElementById('md5-input');
const resultDiv = document.getElementById('result');

queryBtn.addEventListener('click', async () => {
    let md5 = md5Input.value.trim();
    if (!MD5_REGEX.test(md5)) {
        resultDiv.textContent = "❌ MD5格式不正确";
        return;
    }

    // 转小写
    md5 = md5.toLowerCase();

    resultDiv.textContent = "🔍 查询中...";
    try {
        let password = null;

        // GitHub 查询
        try {
            const resp = await fetch('https://raw.githubusercontent.com/Karune-SHI-E/1111/master/passwords_local.json');
            if (resp.ok) {
                const data = await resp.json();

                // 遍历时强制转小写
                const normalizedData = {};
                for (const key in data) {
                    normalizedData[key.toLowerCase()] = data[key];
                }

                if (normalizedData[md5]) password = normalizedData[md5];
            }
        } catch (e) {
            console.warn("GitHub 查询失败:", e);
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
