window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// 自动化抢任务脚本 - PakePlus注入版
// 使用方式：将此文件复制到 src-tauri/data/custom.js

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 PakePlus自动化脚本开始加载...');
    console.log('📍 当前页面URL:', window.location.href);
    
    runAutomation();
});

function runAutomation() {
    // 配置信息
    const CONFIG = {
        login: {
            username: 'To-700',
            password: 'B96GppB75hUw',
            targetUrl: 'https://www.qsxtiahyzx.com/'
        },
        step2: {
            targetUrl: 'https://www.qsxtiahyzx.com/home',
            buttonText: '领取今日任务'
        },
        step3: {
            targetUrl: 'https://www.qsxtiahyzx.com/business_city',
            cityName: '上海',
            buttonText: '确认并拉取任务'
        },
        step4: {
            targetUrl: 'https://www.qsxtiahyzx.com/task',
            refreshButtonText: '重新获取任务',
            startTaskButtonText: '开始执行任务',
            errorText: '响应码异常',
            checkInterval: 100
        },
        delays: {
            betweenActions: 500,
            typingMin: 150,
            typingMax: 400
        }
    };

    // 状态存储
    let step123Completed = sessionStorage.getItem('automation_step123Completed') === 'true';
    let step4Monitoring = sessionStorage.getItem('automation_step4Monitoring') === 'true';
    
    let step4State = {
        refreshCount: parseInt(sessionStorage.getItem('automation_refreshCount')) || 0,
        hasContent: false,
        startTaskButtonFound: false,
        mutationObserver: null,
        lastRefreshTime: parseInt(sessionStorage.getItem('automation_lastRefreshTime')) || 0,
        isReloading: false
    };

    const PAGE_LOAD_TIMEOUT = 5000;

    // 定时抢任务配置
    const TARGET_HOUR = 9;
    const TARGET_MINUTE = 59;
    const TARGET_SECOND = 59;

    function getWaitTimeForTarget() {
        const now = new Date();
        const target = new Date();
        target.setHours(TARGET_HOUR, TARGET_MINUTE, TARGET_SECOND, 0);
        
        if (now.getTime() >= target.getTime()) {
            target.setDate(target.getDate() + 1);
        }
        
        const waitMs = target.getTime() - now.getTime();
        return {
            waitMs: waitMs,
            targetTime: `${String(TARGET_HOUR).padStart(2,'0')}:${String(TARGET_MINUTE).padStart(2,'0')}:${String(TARGET_SECOND).padStart(2,'0')}`
        };
    }

    function saveState() {
        sessionStorage.setItem('automation_step123Completed', step123Completed);
        sessionStorage.setItem('automation_step4Monitoring', step4Monitoring);
        sessionStorage.setItem('automation_refreshCount', step4State.refreshCount);
        sessionStorage.setItem('automation_lastRefreshTime', step4State.lastRefreshTime);
    }

    function clearState() {
        sessionStorage.removeItem('automation_step123Completed');
        sessionStorage.removeItem('automation_step4Monitoring');
        sessionStorage.removeItem('automation_refreshCount');
    }

    function randomDelay(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function isPageFullyLoaded() {
        return document.readyState === 'complete';
    }

    async function waitForPageLoad(maxWaitTime = 30000) {
        console.log('⏳ 等待页面加载完成...');
        const startTime = Date.now();
        
        while (Date.now() - startTime < maxWaitTime) {
            if (isPageFullyLoaded()) {
                await sleep(300);
                console.log('✅ 页面加载完成');
                return true;
            }
            await sleep(200);
        }
        throw new Error('等待页面加载超时');
    }

    async function waitForUrl(targetUrl, maxWaitTime = 60000) {
        console.log(`⏳ 等待跳转到: ${targetUrl}`);
        const startTime = Date.now();
        
        while (Date.now() - startTime < maxWaitTime) {
            if (window.location.href.includes(targetUrl.replace('https://www.qsxtiahyzx.com', ''))) {
                console.log(`✅ 已跳转到目标页面: ${targetUrl}`);
                await sleep(500);
                return true;
            }
            await sleep(300);
        }
        throw new Error(`等待跳转到 ${targetUrl} 超时`);
    }

    async function simulateHumanInput(element, text) {
        element.focus();
        
        const rect = element.getBoundingClientRect();
        const mouseX = rect.left + Math.random() * rect.width;
        const mouseY = rect.top + Math.random() * rect.height;
        
        for (let i = 0; i < 5; i++) {
            const moveX = mouseX + (Math.random() - 0.5) * 20;
            const moveY = mouseY + (Math.random() - 0.5) * 10;
            element.dispatchEvent(new MouseEvent('mousemove', {
                clientX: moveX,
                clientY: moveY,
                bubbles: true
            }));
            await sleep(randomDelay(20, 50));
        }
        
        element.dispatchEvent(new MouseEvent('mousedown', {
            clientX: mouseX,
            clientY: mouseY,
            bubbles: true,
            button: 0
        }));
        await sleep(randomDelay(30, 80));
        
        element.click();
        element.value = '';
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            element.value += char;
            
            element.dispatchEvent(new InputEvent('input', {
                data: char,
                inputType: 'insertText',
                bubbles: true
            }));
            
            element.dispatchEvent(new KeyboardEvent('keyup', {
                key: char,
                bubbles: true
            }));
            
            await sleep(randomDelay(CONFIG.delays.typingMin, CONFIG.delays.typingMax));
        }
        
        element.dispatchEvent(new Event('change', { bubbles: true }));
        await sleep(randomDelay(100, 300));
        element.blur();
    }

    async function simulateHumanClick(element) {
        if (!element) throw new Error('点击元素不存在');
        
        const rect = element.getBoundingClientRect();
        const clickX = rect.left + rect.width / 2 + (Math.random() - 0.5) * rect.width * 0.3;
        const clickY = rect.top + rect.height / 2 + (Math.random() - 0.5) * rect.height * 0.3;
        
        element.dispatchEvent(new MouseEvent('mousemove', {
            clientX: clickX,
            clientY: clickY,
            bubbles: true
        }));
        await sleep(randomDelay(50, 150));
        
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await sleep(randomDelay(100, 200));
        
        element.dispatchEvent(new MouseEvent('mouseenter', {
            clientX: clickX,
            clientY: clickY,
            bubbles: true
        }));
        
        element.dispatchEvent(new MouseEvent('mouseover', {
            clientX: clickX,
            clientY: clickY,
            bubbles: true
        }));
        
        element.dispatchEvent(new MouseEvent('mousedown', {
            clientX: clickX,
            clientY: clickY,
            bubbles: true,
            button: 0
        }));
        
        await sleep(randomDelay(50, 100));
        
        element.click();
        
        element.dispatchEvent(new MouseEvent('mouseup', {
            clientX: clickX,
            clientY: clickY,
            bubbles: true,
            button: 0
        }));
        
        await sleep(100);
    }

    function fastClick(element) {
        if (!element) return false;
        try {
            element.click();
            return true;
        } catch (error) {
            console.error('点击失败:', error.message);
            return false;
        }
    }

    async function step1_login() {
        console.log('🚀 ========== 开始执行步骤一：登录自动化 ==========');
        
        try {
            if (!window.location.href.includes('qsxtiahyzx.com')) {
                console.warn('⚠️ 当前不在目标网站，导航到登录页面...');
                window.location.href = CONFIG.login.targetUrl;
                return;
            }
            
            await waitForPageLoad();
            
            if (window.location.href.includes('/home')) {
                console.log('✅ 检测到已登录，跳过步骤一');
                return;
            }
            
            console.log('🔍 查找用户名输入框...');
            const usernameInput = document.querySelector('input[type="text"][placeholder*="用户名称"]') ||
                                  document.querySelector('input[placeholder*="用户名称"]') ||
                                  document.querySelector('input[type="text"]');
            
            if (!usernameInput) throw new Error('未找到用户名输入框');
            console.log('✅ 找到用户名输入框');
            
            console.log('🔍 查找密码输入框...');
            const passwordInput = document.querySelector('input[type="password"]') ||
                                  document.querySelector('input[placeholder*="密码"]');
            
            if (!passwordInput) throw new Error('未找到密码输入框');
            console.log('✅ 找到密码输入框');
            
            console.log('🔍 查找登录按钮...');
            const loginButton = Array.from(document.querySelectorAll('span')).find(span => 
                span.textContent.trim() === '登录'
            ) || document.querySelector('button') ||
               document.querySelector('.el-button--primary');
            
            if (!loginButton) throw new Error('未找到登录按钮');
            console.log('✅ 找到登录按钮');
            
            console.log('📝 正在输入用户名...');
            await simulateHumanInput(usernameInput, CONFIG.login.username);
            await sleep(CONFIG.delays.betweenActions);
            
            console.log('📝 正在输入密码...');
            await simulateHumanInput(passwordInput, CONFIG.login.password);
            await sleep(CONFIG.delays.betweenActions);
            
            console.log('🖱️ 正在点击登录按钮...');
            await simulateHumanClick(loginButton);
            
            console.log('✅ 步骤一完成：登录流程执行完成！');
            
        } catch (error) {
            console.error('❌ 步骤一出错:', error.message);
            throw error;
        }
    }

    async function step2_claimTask() {
        console.log('🚀 ========== 开始执行步骤二：领取今日任务 ==========');
        
        try {
            await waitForUrl(CONFIG.step2.targetUrl);
            await waitForPageLoad();
            
            console.log('🔍 查找领取任务按钮...');
            const claimButton = Array.from(document.querySelectorAll('span')).find(span => {
                return span.textContent.trim().includes(CONFIG.step2.buttonText);
            });
            
            if (!claimButton) throw new Error(`未找到"${CONFIG.step2.buttonText}"按钮`);
            console.log(`✅ 找到"${CONFIG.step2.buttonText}"按钮`);
            
            claimButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await sleep(200);
            
            console.log(`🖱️ 正在点击"${CONFIG.step2.buttonText}"按钮...`);
            await simulateHumanClick(claimButton);
            
            console.log('✅ 步骤二完成！');
            
        } catch (error) {
            console.error('❌ 步骤二出错:', error.message);
            throw error;
        }
    }

    async function step3_selectCity() {
        console.log('🚀 ========== 开始执行步骤三：选择城市并拉取任务 ==========');
        
        try {
            await waitForUrl(CONFIG.step3.targetUrl);
            await waitForPageLoad();
            
            console.log('🔍 查找省份输入框...');
            let provinceInput = document.querySelector('input[placeholder="请选择省份"]') ||
                               Array.from(document.querySelectorAll('input[readonly]')).find(input => 
                                   input.getAttribute('placeholder') === '请选择省份'
                               );
            
            if (!provinceInput) {
                const inputs = document.querySelectorAll('input[placeholder]');
                for (let input of inputs) {
                    if (input.placeholder.includes('省份')) {
                        provinceInput = input;
                        break;
                    }
                }
            }
            
            if (!provinceInput) throw new Error('未找到省份输入框');
            console.log('✅ 找到省份输入框');
            
            console.log('🖱️ 正在点击省份输入框...');
            await simulateHumanClick(provinceInput);
            await sleep(500);
            
            console.log('🔍 等待"上海"选项出现...');
            let provinceOption = null;
            
            for (let i = 0; i < 20; i++) {
                const options = document.querySelectorAll('.el-select-dropdown__item span, .el-select-dropdown span, .el-dropdown-menu span, span');
                for (let option of options) {
                    const text = option.textContent.trim();
                    if (text === '上海') {
                        provinceOption = option;
                        break;
                    }
                }
                if (provinceOption) break;
                await sleep(200);
            }
            
            if (!provinceOption) throw new Error('未找到省份选项: 上海');
            console.log(`✅ 找到省份选项: ${provinceOption.textContent.trim()}`);
            
            console.log('🖱️ 正在点击"上海"...');
            await simulateHumanClick(provinceOption);
            await sleep(500);
            
            console.log('🔍 查找城市输入框...');
            let cityInput = document.querySelector('input[placeholder="请选择城市"]') ||
                           Array.from(document.querySelectorAll('input[readonly]')).find(input => 
                               input.getAttribute('placeholder') === '请选择城市'
                           );
            
            if (!cityInput) {
                const inputs = document.querySelectorAll('input[placeholder]');
                for (let input of inputs) {
                    if (input.placeholder.includes('城市')) {
                        cityInput = input;
                        break;
                    }
                }
            }
            
            if (!cityInput) throw new Error('未找到城市输入框');
            console.log('✅ 找到城市输入框');
            
            console.log('🖱️ 正在点击城市输入框...');
            await simulateHumanClick(cityInput);
            await sleep(500);
            
            console.log('🔍 等待"上海市"选项出现...');
            let cityOption = null;
            
            for (let i = 0; i < 20; i++) {
                const options = document.querySelectorAll('.el-select-dropdown__item span, .el-select-dropdown span, .el-dropdown-menu span, span');
                for (let option of options) {
                    const text = option.textContent.trim();
                    if (text === '上海市') {
                        cityOption = option;
                        break;
                    }
                }
                if (cityOption) break;
                await sleep(200);
            }
            
            if (!cityOption) throw new Error('未找到城市选项: 上海市');
            console.log(`✅ 找到城市选项: ${cityOption.textContent.trim()}`);
            
            console.log('🖱️ 正在点击"上海市"...');
            await simulateHumanClick(cityOption);
            await sleep(1000);
            
            // 等待定时到达
            const waitInfo = getWaitTimeForTarget();
            console.log(`⏰ 当前时间: ${new Date().toLocaleTimeString()}`);
            console.log(`⏰ 目标时间: ${waitInfo.targetTime}`);
            console.log(`⏰ 等待毫秒: ${waitInfo.waitMs}`);
            
            if (waitInfo.waitMs > 0) {
                console.log(`⏰ 等待定时抢任务: ${waitInfo.targetTime}`);
                console.log(`⏳ 还需等待: ${Math.floor(waitInfo.waitMs / 1000)} 秒`);
                
                const startWaitTime = Date.now();
                while (Date.now() - startWaitTime < waitInfo.waitMs) {
                    const remaining = Math.floor((waitInfo.waitMs - (Date.now() - startWaitTime)) / 1000);
                    if (remaining > 0 && remaining % 10 === 0 && remaining < waitInfo.waitMs / 1000) {
                        console.log(`⏳ 还剩 ${remaining} 秒...`);
                    }
                    await sleep(1000);
                }
                
                console.log('⏰ 时间到达，点击确认并拉取任务按钮！');
            } else {
                console.log('⏰ 时间已过，立即点击确认并拉取任务按钮！');
            }
            
            console.log(`🔍 查找"${CONFIG.step3.buttonText}"按钮...`);
            let pullTaskButton = null;
            
            const buttons = document.querySelectorAll('span, button, div[role="button"], a');
            for (let btn of buttons) {
                const text = btn.textContent.trim();
                if (text.includes('确认') && text.includes('拉取')) {
                    pullTaskButton = btn;
                    break;
                }
            }
            
            if (!pullTaskButton) {
                pullTaskButton = document.querySelector('.el-button--primary');
            }
            
            if (!pullTaskButton) throw new Error(`未找到"${CONFIG.step3.buttonText}"按钮`);
            console.log(`✅ 找到"${CONFIG.step3.buttonText}"按钮`);
            
            console.log(`🖱️ 正在点击确认并拉取任务按钮...`);
            await simulateHumanClick(pullTaskButton);
            
            console.log('✅ 步骤三完成！');
            
        } catch (error) {
            console.error('❌ 步骤三出错:', error.message);
            throw error;
        }
    }

    function isBlankPage() {
        if (!document.body) return true;
        const bodyText = document.body.textContent || '';
        if (bodyText.trim().length === 0) return true;
        
        const visibleElements = document.body.querySelectorAll('*');
        for (let element of visibleElements) {
            const tagName = element.tagName.toLowerCase();
            if (['script', 'style', 'noscript', 'meta', 'link'].includes(tagName)) continue;
            
            const style = window.getComputedStyle(element);
            if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') continue;
            
            const text = element.textContent || '';
            if (text.trim().length > 0) return false;
        }
        return true;
    }

    function hasErrorText() {
        const bodyText = document.body.textContent || '';
        return bodyText.includes(CONFIG.step4.errorText);
    }

    function findRefreshButton() {
        const buttons = document.querySelectorAll('span, button, div[role="button"], a');
        for (let btn of buttons) {
            if (btn.textContent.trim().includes(CONFIG.step4.refreshButtonText)) {
                return btn;
            }
        }
        return null;
    }

    function findStartTaskButton() {
        const buttons = document.querySelectorAll('span, button, div[role="button"], a');
        for (let btn of buttons) {
            if (btn.textContent.trim().includes(CONFIG.step4.startTaskButtonText)) {
                return btn;
            }
        }
        return null;
    }

    function forceRefresh() {
        step4State.refreshCount++;
        step4State.lastRefreshTime = Date.now();
        step4State.hasContent = false;
        step4State.isReloading = true;
        console.log(`🔄 正在刷新页面... (第 ${step4State.refreshCount} 次)`);
        saveState();
        
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('_t', Date.now());
        window.location.href = currentUrl.toString();
    }

    function checkPageLoadTimeout() {
        if (!step4State.isReloading) return false;
        
        const timeSinceRefresh = Date.now() - step4State.lastRefreshTime;
        if (timeSinceRefresh > PAGE_LOAD_TIMEOUT) {
            console.warn(`⚠️ 页面加载超时 (${Math.round(timeSinceRefresh/1000)}秒)，准备再次刷新...`);
            return true;
        }
        return false;
    }

    function setupMutationObserver() {
        if (step4State.mutationObserver) return;

        step4State.mutationObserver = new MutationObserver(() => {
            if (step4Monitoring && step4State.hasContent && !step4State.startTaskButtonFound) {
                const startTaskButton = findStartTaskButton();
                if (startTaskButton) {
                    console.log('🎉 检测到"开始执行任务"按钮！');
                    step4State.startTaskButtonFound = true;
                    step4Monitoring = false;
                    clearState();
                    return;
                }

                const refreshButton = findRefreshButton();
                if (refreshButton) {
                    console.log('⚡ 检测到"重新获取任务"按钮，立即点击！');
                    fastClick(refreshButton);
                }
            }
        });

        step4State.mutationObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true
        });

        console.log('✅ DOM监听器已设置');
    }

    async function checkPageStatus() {
        if (checkPageLoadTimeout()) {
            forceRefresh();
            return;
        }

        if (hasErrorText()) {
            console.warn('⚠️ 检测到错误文本，准备刷新');
            forceRefresh();
            return;
        }

        if (isBlankPage()) {
            console.warn('⚠️ 检测到空白页，准备刷新');
            forceRefresh();
            return;
        }

        if (step4State.isReloading && !isBlankPage()) {
            console.log('✅ 页面加载完成');
            step4State.isReloading = false;
            step4State.lastRefreshTime = 0;
        }

        step4State.hasContent = true;
        
        const startTaskButton = findStartTaskButton();
        if (startTaskButton) {
            console.log('🎉 找到"开始执行任务"按钮！任务抢到了！');
            step4State.startTaskButtonFound = true;
            step4Monitoring = false;
            clearState();
            alert('🎉 任务抢到了！请开始执行任务！');
            return;
        }
        
        const refreshButton = findRefreshButton();
        if (refreshButton) {
            console.log('⚡ 点击"重新获取任务"按钮');
            fastClick(refreshButton);
        }
    }

    async function step4_monitorTask() {
        console.log('🚀 ========== 开始执行步骤四：循环监控抢任务 ==========');
        
        try {
            if (!window.location.href.includes('/task')) {
                console.log('⏳ 等待跳转到任务页面...');
                await waitForUrl(CONFIG.step4.targetUrl);
            }
            
            await waitForPageLoad();
            
            if (!step4Monitoring) {
                step4Monitoring = true;
                step4State.hasContent = false;
                step4State.startTaskButtonFound = false;
            }
            
            setupMutationObserver();
            
            await checkPageStatus();
            
            console.log('🔄 开始循环监控...');
            while (step4Monitoring && !step4State.startTaskButtonFound) {
                await sleep(CONFIG.step4.checkInterval);
                
                if (!isPageFullyLoaded()) continue;
                
                if (step4State.hasContent) {
                    await checkPageStatus();
                } else {
                    if (!isBlankPage() && !hasErrorText()) {
                        step4State.hasContent = true;
                        await checkPageStatus();
                    }
                }
                
                saveState();
            }
            
            if (step4State.startTaskButtonFound) {
                console.log('🎉 自动化流程完成：抢到任务！');
            }
            
        } catch (error) {
            console.error('❌ 步骤四出错:', error.message);
            console.log('🔄 出错后刷新页面继续...');
            forceRefresh();
        }
    }

    async function executeSteps1to3() {
        console.log('🚀 ========== 执行步骤1-3（只执行一次） ==========');
        
        try {
            await step1_login();
            await sleep(2000);
            await step2_claimTask();
            await sleep(2000);
            await step3_selectCity();
            
            step123Completed = true;
            saveState();
            
            console.log('✅ 步骤1-3全部完成！');
            
        } catch (error) {
            console.error('❌ 步骤1-3执行出错:', error.message);
            throw error;
        }
    }

    async function mainController() {
        console.log('🚀 PakePlus主控制器启动');
        console.log('🔧 步骤1-3已完成:', step123Completed);
        console.log('🔧 步骤四监控中:', step4Monitoring);
        
        try {
            const currentUrl = window.location.href;
            
            if (currentUrl.includes('/task') && step123Completed) {
                console.log('📍 检测到在任务页面且步骤1-3已完成，直接执行步骤四');
                await step4_monitorTask();
                return;
            }
            
            if (!step123Completed) {
                await executeSteps1to3();
            }
            
            await step4_monitorTask();
            
        } catch (error) {
            console.error('❌ 主控制器出错:', error.message);
            
            if (step4Monitoring) {
                console.log('🔄 步骤四出错，刷新页面继续...');
                setTimeout(() => {
                    forceRefresh();
                }, 2000);
            }
        }
    }

    console.log('✅ PakePlus脚本初始化完成，准备执行自动化...');
    mainController();
}