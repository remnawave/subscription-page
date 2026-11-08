export interface ICommandResponse<T> {
    code?: string;
    isOk: boolean;
    message?: string;
    notFound?: boolean;
    response?: T;
}
