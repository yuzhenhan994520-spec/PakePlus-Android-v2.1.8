window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});var hasFilled = false;
var hasClickedLogin = false;
var hasClicked4 = false;
var hasClicked2 = false;
var hasClicked3 = false;
var scriptStopped = false;

document.addEventListener('DOMContentLoaded', function() {
    autoFillLogin();
});

function autoFillLogin() {
    var targetUrl = 'https://www.u8mm0j2j4.com';
    
    function fill() {
        if (scriptStopped || window.location.href.indexOf(targetUrl) === -1) {
            return;
        }
        
        if (hasFilled && hasClickedLogin) {
            return;
        }
        
        var usernameInput = document.querySelector("#app > div > form > div:nth-child(1) > div > div.el-input.el-input--suffix > input");
        var passwordInput = document.querySelector("#app > div > form > div:nth-child(2) > div > div:nth-child(1) > div > input");
        var loginButton = document.querySelector("#app > div > span > button:nth-child(1) > span");
        
        if (usernameInput && passwordInput && loginButton) {
            if (!hasFilled) {
                usernameInput.value = 'AADdy11-069';
                usernameInput.dispatchEvent(new Event('input', { bubbles: true }));
                usernameInput.dispatchEvent(new Event('change', { bubbles: true }));
                
                passwordInput.value = 'f3QhMXmSL3vR';
                passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
                passwordInput.dispatchEvent(new Event('change', { bubbles: true }));
                
                hasFilled = true;
            }
            
            if (hasFilled && !hasClickedLogin) {
                loginButton.click();
                hasClickedLogin = true;
            }
        } else {
            setTimeout(fill, 500);
        }
    }
    
    setTimeout(fill, 2000);
    
    setInterval(function() {
        if (scriptStopped) return;
        
        if (!hasFilled || !hasClickedLogin) {
            fill();
        }
        
        checkAndClickBtn4();
        checkAndClickBtn2();
        checkBtn3AndStop();
    }, 500);
}

function findByXPath(xpath) {
    try {
        var result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        return result.singleNodeValue;
    } catch (e) {
        return null;
    }
}

function checkAndClickBtn4() {
    if (scriptStopped || hasClicked4) {
        return;
    }
    
    var xpath = "//button[contains(@class,'el-button--primary')]//span[contains(text(),'领取今日任务')]";
    var btn = findByXPath(xpath);
    
    if (btn && btn.parentElement) {
        btn.parentElement.click();
        hasClicked4 = true;
    }
}

function checkAndClickBtn2() {
    if (scriptStopped || !hasClicked4 || hasClicked2) {
        return;
    }
    
    var xpath = "//button[contains(@class,'el-button--primary')]//span[contains(text(),'确认并拉取任务')]";
    var btn = findByXPath(xpath);
    
    if (btn && btn.parentElement) {
        btn.parentElement.click();
        hasClicked2 = true;
    }
}

function checkBtn3AndStop() {
    if (scriptStopped) {
        return;
    }
    
    if (!hasClicked2) {
        return;
    }
    
    var xpath3 = "//button[contains(@class,'el-button--primary')]//span[contains(text(),'重新获取任务')]";
    var btn3 = findByXPath(xpath3);
    
    if (btn3 && btn3.parentElement && !hasClicked3) {
        btn3.parentElement.click();
        hasClicked3 = true;
        return;
    }
    
    var xpath4 = "//button[contains(@class,'el-button--primary')]//span[contains(text(),'开始执行任务')]";
    var btn4 = findByXPath(xpath4);
    
    var errorText = findByXPath("//span[contains(text(),'响应码异常:3')]");
    
    if (btn4 || errorText) {
        scriptStopped = true;
        return;
    }
    
    if (hasClicked3) {
        hasClicked3 = false;
    }
}
