module.exports = {
    extends: [
        "@commitlint/config-conventional"
    ],

    /**
     * 规则
     * @description
     * 1. 规则由规则名称和配置数组组成
     * 2. 配置数组:
     *    Level 0:无效,1:警告,2:错误
     *    Applicable always|never : never会颠倒规则
     *    Value 用于此规则的值
     * 3. 可用规则: https://commitlint.js.org/#/reference-rules
     */
    rules: {
        /* 
        类型
        feat: 新功能, fix: 修补bug, docs: 文档, style: 格式(不影响代码运行的变动)
        refactor: 重构(即不是新增功能, 也不是修改bug的代码变动), test: 增加测试, chore: 构建过程或辅助工具的变动
        */
        'type-enum': [2, 'always', [
            'upd', 'feat', 'fix', 'refactor', 'docs', 'chore', 'style', 'revert'
        ]],
        'type-case': [0],
        'type-empty': [0],
        'scope-empty': [0],
        'scope-case': [0],
        'subject-full-stop': [0, 'never'],
        'subject-case': [0, 'never'],
        'header-max-length': [0, 'always', 72],
        // 影响范围
        'scope-enum': [1, 'always', ['all']]
    }
};