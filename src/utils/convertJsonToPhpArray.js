export const convertJsonToPhpArray = (jsonObj = {}) => {
    const indent = (level) => '  '.repeat(level);

    const formatValue = (value, level) => {
        if (Array.isArray(value)) {
            if (value.length === 0) return 'array()';
            return `array(\n${value
                .map((v) => `${indent(level + 1)}${formatValue(v, level + 1)}`)
                .join(',\n')}\n${indent(level)})`;
        }

        if (typeof value === 'object' && value !== null) {
            const keys = Object.keys(value);
            if (keys.length === 0) return 'array()';
            return `array(\n${keys
                .map((key) => `${indent(level + 1)}'${key}' => ${formatValue(value[key], level + 1)}`)
                .join(',\n')}\n${indent(level)})`;
        }

        if (typeof value === 'string') {
            return `'${value.replace(/'/g, "\\'")}'`;
        }

        return String(value);
    };

    const output = `array(\n${Object.keys(jsonObj)
        .map((key) => `  '${key}' => ${formatValue(jsonObj[key], 1)}`)
        .join(',\n')}\n)`;

    return output;
};
