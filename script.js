const MD5_REGEX = /^[a-fA-F0-9]{32}$/;
const queryBtn = document.getElementById('query-btn');
const md5Input = document.getElementById('md5-input');
const resultDiv = document.getElementById('result');
const clearCacheBtn = document.getElementById('clear-cache-btn');

const CACHE_KEY = "password_cache";

function loadCache() {
    try {
        return JSON.parse(localStorage.getItem(CACHE_KEY)) || {};
    } catch {
        return {};
    }
}

function saveCache(cache) {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

function setButtonLoading(loading) {
    if (loading) {
        queryBtn.classList.add("loading");
        queryBtn.disabled = true;
    } else {
        queryBtn.classList.remove("loading");
        queryBtn.disabled = false;
    }
}

async function handleQuery() {
    const md5 = md5Input.value.trim();
    if (!MD5_REGEX.test(md5)) {
        resultDiv.textContent = "❌ MD5格式不正确";
        resultDiv.style.color = "#ff6b6b";
        return;
    }

    setButtonLoading(true);
    resultDiv.style.opacity = 0;

    let password = null;
    let cache = loadCache();

    if (cache[md5]) {
        password = cache[md5];
        console.log("缓存命中:", md5);
    } else {
        try {
            const resp = await fetch('https://raw.githubusercontent.com/Karune-SHI-E/1111/master/passwords_local.json');
            if (resp.ok) {
                const data = await resp.json();
                if (data[md5]) {
                    password = data[md5];
                    cache[md5] = password;
                    saveCache(cache);
                }
            }
        } catch (e) {
            console.warn("GitHub 查询失败:", e);
        }
    }

    if (password) {
        resultDiv.textContent = `🔑 密码: ${password}`;
        resultDiv.style.color = "#4caf50";
    } else {
        resultDiv.textContent = "❌ 未找到密码";
        resultDiv.style.color = "#ff6b6b";
    }

    requestAnimationFrame(() => {
        resultDiv.style.opacity = 1;
    });

    setButtonLoading(false);
}

// 点击按钮
queryBtn.addEventListener('click', handleQuery);

// 回车触发
md5Input.addEventListener('keypress', e => {
    if (e.key === "Enter") handleQuery();
});

// 清空缓存
clearCacheBtn.addEventListener('click', () => {
    localStorage.removeItem(CACHE_KEY);
    resultDiv.textContent = "🗑️ 缓存已清空";
    resultDiv.style.color = "#ff9800";
});
