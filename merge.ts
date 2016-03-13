export default function merge<T1, T2>(onto: T1, from: T2): T1 & T2 {
    if (typeof from !== "object" || from instanceof Array) {
        throw new Error("merge: 'from' must be an ordinary object");
    }
    Object.keys(from).forEach(key => (onto as any)[key] = (from as any)[key]);
    return onto as T1 & T2;
}
