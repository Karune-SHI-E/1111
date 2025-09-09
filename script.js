const MD5_REGEX = /^[a-fA-F0-9]{32}$/;
const queryBtn = document.getElementById('query-btn');
const md5Input = document.getElementById('md5-input');
const resultDiv = document.getElementById('result');

async function handleQuery() {
    const md5 = md5Input.value.trim();
    if (!MD5_REGEX.test(md5)) {
        resultDiv.textContent = "❌ MD5格式不正确";
        resultDiv.style.color = "#ff6b6b";
        return;
    }

    // 按钮进入加载状态
    queryBtn.disabled = true;
    queryBtn.textContent = "查询中...";
    resultDiv.textContent = "🔍 查询中...";
    resultDiv.style.color = "#e0e0e0";
    resultDiv.style.opacity = 0;

    try {
        let password = null;

        // GitHub 查询
        try {
            const resp = await fetch('https://raw.githubusercontent.com/Karune-SHI-E/1111/master/passwords_local.json');
            if (resp.ok) {
                const data = await resp.json();
                if (data[md5]) password = data[md5];
            }
        } catch (e) {
            console.warn("GitHub 查询失败:", e);
        }

        if (password) {
            resultDiv.textContent = `🔑 密码: ${password}`;
            resultDiv.style.color = "#4caf50";
        } else {
            resultDiv.textContent = "❌ 未找到密码";
            resultDiv.style.color = "#ff6b6b";
        }
    } catch (e) {
        console.error(e);
        resultDiv.textContent = "⚠️ 查询失败，请检查网络";
        resultDiv.style.color = "#ff9800";
    }

    // 渐显效果
    resultDiv.style.transition = "opacity 0.6s ease";
    requestAnimationFrame(() => {
        resultDiv.style.opacity = 1;
    });

    // 按钮恢复
    queryBtn.disabled = false;
    queryBtn.textContent = "查询密码";
}

// 点击按钮
queryBtn.addEventListener('click', handleQuery);

// 输入框回车触发
md5Input.addEventListener('keypress', e => {
    if (e.key === "Enter") handleQuery();
});
