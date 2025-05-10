module.exports = {
    apps: [
        {
            name: 'remnawave-subscription-page',
            script: 'dist/src/main.js',
            watch: false,
            instances: process.env.SUBSCRIPTION_PAGE_INSTANCES || 1,
            merge_logs: true,
            exec_mode: 'cluster',
            instance_var: 'INSTANCE_ID',
            env_development: {
                NODE_ENV: 'development',
            },
            env_production: {
                NODE_ENV: 'production',
            },
            namespace: 'subscription-page',
        },
    ],
};
