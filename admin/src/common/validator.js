/**
 * el-form 表单验证自定义验证函数
 */
export default {
    /**
     * 整数验证
     * @param {String} rule
     * @param {String} value
     * @param {Function} callback
     */
    intValidator(rule, value, callback) {
        if (value && !/^-?[1-9][0-9]*$/.test(value + '')) {
            return callback(new Error('请输入整数'))
        }
        callback()
    },
    /**
     * 正整数验证
     * @param {String} rule
     * @param {String} value
     * @param {Function} callback
     */
    posIntValidator(rule, value, callback) {
        const num = Number(value)
        if (value && !/^[1-9][0-9]*$/.test(value + '')) {
            return callback(new Error('请输入正整数'))
        }
        callback()
    },
    /**
     * 英文名验证
     * @param {String} rule
     * @param {String} value
     * @param {Function} callback
     */
    eNameValidator(rule, value, callback) {
        if (value && !/^[a-zA-Z_0-9]+$/.test(value)) {
            return callback(new Error('只能是字母，数字，下划线'))
        }
        callback()
    },
    /**
     * 中文名验证
     * @param {String} rule
     * @param {String} value
     * @param {Function} callback
     */
    cNameValidator(rule, value, callback) {
        if (value && !/^[\u4e00-\u9fa5_0-9]+$/.test(value)) {
            return callback(new Error('只能是汉字，数字，下划线'))
        }
        callback()
    },
    /**
     * ip地址验证
     * @param {String} rule
     * @param {String} value
     * @param {Function} callback
     */
    ipValidator(rule, value, callback) {
        const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
        if (value && !reg.test(value)) {
            return callback(new Error('ip地址不正确'))
        }
        callback()
    }
}
