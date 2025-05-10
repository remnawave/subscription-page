/* eslint-disable prettier/prettier */

module.exports = {
    templates: `${__dirname}/.hygen`,
    helpers: {
        /* ******* Helpers ******* */
        dasherize(str) {
            return this.inflection.dasherize(str).toLowerCase();
        },
        singularize(str) {
            // user -> users
            return this.inflection.singularize(str);
        },
        pluralize(str) {
            // user -> users
            return this.inflection.pluralize(str);
        },
        toDashCase(str) {
            // Convert any case to dash-case
            return str
                .replace(/([a-z])([A-Z])/g, '$1-$2')
                .replace(/_/g, '-')
                .toLowerCase();
        },

        pascalSingularize(str) {
            // users -> User
            return this.changeCase.pascal(this.singularize(str));
        },
        pascalPluralize(str) {
            // user -> Users
            return this.changeCase.pascal(this.pluralize(str));
        },

        /* ******* ******* ******* New `Module` ******* ******* ******* */
        /* ******* ******* ******* ******* ******* ******* ******* ******* */

        instanceName(name) {
            return this.changeCase.camel(this.EntityName(name));
        },

        /* ******* Module, controller, service, repository names ******* */
        ModuleName(name) {
            return `${this.pascalPluralize(name)}Module`;
        },
        ControllerName(name) {
            return `${this.pascalPluralize(name)}Controller`;
        },
        ServiceName(name) {
            return `${this.pascalPluralize(name)}Service`;
        },
        RepositoryName(name) {
            return `${this.pascalPluralize(name)}Repository`;
        },

        /* ******* Module, controller, service, repository folder/file names ******* */
        moduleFolderName(name) {
            return `${this.pluralize(this.toDashCase(name))}`;
        },
        moduleFileName(name) {
            return `${this.moduleFolderName(name)}.module`;
        },
        controllerFileName(name) {
            return `${this.moduleFolderName(name)}.controller`;
        },
        repositoryFileName(name) {
            return `${this.moduleFolderName(name)}.repository`;
        },
        serviceFileName(name) {
            return `${this.moduleFolderName(name)}.service`;
        },

        /* ******* Entity and table names ******* */
        entitiesFolderName() {
            return `entities`;
        },

        TableName(name) {
            name = name.replace(/-/g, '_');

            return this.inflection.pluralize(this.inflection.underscore(name).toLowerCase());
        },
        EntityName(name) {
            return this.pascalSingularize(name);
        },

        entityFileName(name) {
            return `${this.toDashCase(this.singularize(name))}.entity`;
        },

        /* ******* Dtos ******* */
        dtosFolderName() {
            return `dto`;
        },

        ResponseDtoName(name) {
            return `${this.pascalSingularize(name)}ResponseDto`;
        },
        CreateDtoName(name) {
            return `Create${this.pascalSingularize(name)}Dto`;
        },
        GetDtoName(name) {
            return `Get${this.pascalPluralize(name)}Dto`;
        },
        UpdateDtoName(name) {
            return `Update${this.pascalSingularize(name)}Dto`;
        },

        responseDtoFileName(name) {
            return `${this.singularize(name)}-response.dto`;
        },
        createDtoFileName(name) {
            return `create-${this.singularize(name)}.dto`;
        },
        getDtoFileName(name) {
            return `get-${this.pluralize(name)}.dto`;
        },
        updateDtoFileName(name) {
            return `update-${this.singularize(name)}.dto`;
        },

        /* ******* ******* ******* New `Queue` ******* ******* ******* */
        /* ******* ******* ******* ******* ******* ******* ******* ******* */

        QueueNameEnumKey(queueName) {
            return this.changeCase.camel(queueName);
        },

        queueJobNamesEnumFileName(queueName) {
            return `${this.queueFolderName(queueName)}-job-names.enum`;
        },
        QueueJobNamesEnumName(queueName) {
            return `${this.changeCase.pascal(queueName)}JobNames`;
        },

        queueParamName(queueName) {
            return `${this.changeCase.camel(queueName)}Queue`;
        },

        /* ******* Queue module, processor, service names ******* */
        QueueModuleName(queueName) {
            return `${this.changeCase.pascal(queueName)}QueueModule`;
        },
        QueueProcessorName(queueName) {
            return `${this.changeCase.pascal(queueName)}QueueProcessor`;
        },
        QueueServiceName(queueName) {
            return `${this.changeCase.pascal(queueName)}QueueService`;
        },

        /* ******* Queue module, processor, service folder/file names ******* */
        queueFolderName(queueName) {
            return this.toDashCase(queueName);
        },

        queueModuleFileName(queueName) {
            return `${this.queueFolderName(queueName)}.module`;
        },
        queueProcessorFileName(queueName) {
            return `${this.queueFolderName(queueName)}.processor`;
        },
        queueServiceFileName(queueName) {
            return `${this.queueFolderName(queueName)}.service`;
        },
    },
};
