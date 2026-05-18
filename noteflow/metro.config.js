const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);
config.resolver = {
    ...config.resolver,
    unstable_enablePackageExports: false,
    resolveRequest: (context, moduleName, platform) => {
        if (platform === 'web' && moduleName === 'zustand/middleware') {
            return {
                filePath: path.resolve(__dirname, 'node_modules/zustand/middleware.js'),
                type: 'sourceFile',
            };
        }
        return context.resolveRequest(context, moduleName, platform);
    }
}

config.transformer = {
    ...config.transformer,
    unstable_transformProfile: 'default',
};

module.exports = config;
