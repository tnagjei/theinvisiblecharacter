// 测试隐形字符网站核心功能
console.log('开始测试隐形字符网站核心功能...');

// 测试隐形字符库
function testCharacterLibrary() {
    console.log('测试隐形字符库...');

    if (typeof InvisibleCharacterLibrary === 'undefined') {
        console.error('❌ InvisibleCharacterLibrary 未定义');
        return false;
    }

    try {
        // 测试库初始化
        const library = new InvisibleCharacterLibrary();
        console.log('✅ 隐形字符库初始化成功');

        // 测试字符获取
        const characters = library.getCharacters();
        console.log(`✅ 获取到 ${characters.length} 个隐形字符`);

        // 测试字符复制功能
        if (characters.length > 0) {
            const testChar = characters[0];
            console.log(`✅ 测试字符: ${testChar.name} (${testChar.character})`);

            // 测试字符验证
            const isValid = library.validateCharacter(testChar.character);
            console.log(`✅ 字符验证结果: ${isValid ? '有效' : '无效'}`);

            // 测试字符检测
            const detected = library.detectInvisibleCharacters('测试' + testChar.character + '文本');
            console.log(`✅ 字符检测结果: 检测到 ${detected.length} 个隐形字符`);
        }

        return true;
    } catch (error) {
        console.error('❌ 隐形字符库测试失败:', error);
        return false;
    }
}

// 测试剪贴板功能
function testClipboardManager() {
    console.log('测试剪贴板管理器...');

    if (typeof ClipboardManager === 'undefined') {
        console.error('❌ ClipboardManager 未定义');
        return false;
    }

    try {
        const clipboard = new ClipboardManager();
        console.log('✅ 剪贴板管理器初始化成功');

        // 测试剪贴板支持
        const isSupported = clipboard.isSupported();
        console.log(`✅ 剪贴板支持: ${isSupported ? '支持' : '不支持'}`);

        // 测试复制功能（如果支持）
        if (isSupported) {
            clipboard.copy('测试文本').then(() => {
                console.log('✅ 复制功能测试成功');
            }).catch(error => {
                console.error('❌ 复制功能测试失败:', error);
            });
        }

        return true;
    } catch (error) {
        console.error('❌ 剪贴板管理器测试失败:', error);
        return false;
    }
}

// 测试检测器功能
function testDetector() {
    console.log('测试隐形字符检测器...');

    if (typeof InvisibleCharacterDetector === 'undefined') {
        console.error('❌ InvisibleCharacterDetector 未定义');
        return false;
    }

    try {
        const detector = new InvisibleCharacterDetector();
        console.log('✅ 隐形字符检测器初始化成功');

        // 测试检测功能
        const testText = '测试\u200B\u200C\u200D文本';
        const result = detector.detectInvisibleCharacters(testText);
        console.log(`✅ 检测结果: ${result.totalMatches} 个隐形字符`);

        // 测试清理功能
        const cleanResult = detector.cleanInvisibleCharacters(testText);
        console.log(`✅ 清理结果: 移除了 ${cleanResult.removedCount} 个隐形字符`);

        return true;
    } catch (error) {
        console.error('❌ 检测器测试失败:', error);
        return false;
    }
}

// 测试主应用
function testMainApp() {
    console.log('测试主应用...');

    if (typeof InvisibleCharacterApp === 'undefined') {
        console.error('❌ InvisibleCharacterApp 未定义');
        return false;
    }

    try {
        const app = new InvisibleCharacterApp();
        console.log('✅ 主应用初始化成功');

        // 测试组件获取
        const library = app.getComponent('library');
        const clipboard = app.getComponent('clipboard');
        const detector = app.getComponent('detector');

        console.log(`✅ 组件检查:`, {
            library: !!library,
            clipboard: !!clipboard,
            detector: !!detector
        });

        return true;
    } catch (error) {
        console.error('❌ 主应用测试失败:', error);
        return false;
    }
}

// 测试DOM元素
function testDOMElements() {
    console.log('测试DOM元素...');

    const elements = {
        '字符搜索框': '#character-search',
        '字符过滤器': '#character-filter',
        '字符网格': '#character-grid',
        '检测器输入框': '#detector-input',
        '检测按钮': '#detect-button',
        '检测结果容器': '#detection-results'
    };

    let allElementsFound = true;

    for (const [name, selector] of Object.entries(elements)) {
        const element = document.querySelector(selector);
        if (element) {
            console.log(`✅ ${name}: 找到元素`);
        } else {
            console.warn(`⚠️ ${name}: 未找到元素 (${selector})`);
            allElementsFound = false;
        }
    }

    return allElementsFound;
}

// 运行所有测试
async function runAllTests() {
    console.log('🚀 开始运行所有测试...\n');

    const results = {
        characterLibrary: testCharacterLibrary(),
        clipboardManager: testClipboardManager(),
        detector: testDetector(),
        mainApp: testMainApp(),
        domElements: testDOMElements()
    };

    console.log('\n📊 测试结果汇总:');
    console.log('字符库:', results.characterLibrary ? '✅ 通过' : '❌ 失败');
    console.log('剪贴板:', results.clipboardManager ? '✅ 通过' : '❌ 失败');
    console.log('检测器:', results.detector ? '✅ 通过' : '❌ 失败');
    console.log('主应用:', results.mainApp ? '✅ 通过' : '❌ 失败');
    console.log('DOM元素:', results.domElements ? '✅ 通过' : '❌ 失败');

    const passed = Object.values(results).filter(Boolean).length;
    const total = Object.keys(results).length;

    console.log(`\n🎯 测试完成: ${passed}/${total} 项通过`);

    if (passed === total) {
        console.log('🎉 所有测试通过！网站功能正常');
    } else {
        console.warn('⚠️ 部分测试失败，请检查相关功能');
    }

    return results;
}

// 等待DOM加载完成后运行测试
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAllTests);
} else {
    runAllTests();
}

// 导出测试函数供外部使用
window.runCharacterTests = runAllTests;