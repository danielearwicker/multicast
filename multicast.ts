import merge from "./merge";

interface Subscribable<TFunc extends Function> {
    add(handler: TFunc): Multicast<TFunc>;
    remove(handler: TFunc): Multicast<TFunc>;
}

type Multicast<TFunc extends Function> = Subscribable<TFunc> & TFunc;

export default function multicast<TFunc extends Function>(...handlers: TFunc[]): Multicast<TFunc> {

    handlers = handlers;

    const subscribable: Subscribable<TFunc> = {
        add(handler) {
            return multicast(...handlers.concat(handler));
        },
        remove(handler) {
            return multicast(...handlers.filter(h => h !== handler));
        }
    };

    const invoke: TFunc = ((...args: any[]) => {
        let result: any;
        handlers.forEach(handler => result = handler.apply(null, args));
        return result;
    }) as any;
    
    return merge(invoke, subscribable);
}
