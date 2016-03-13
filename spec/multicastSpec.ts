import multicast from "../multicast";

describe("multicast", () => {
   
   it("returns undefined when call while empty", () => {
        const empty = multicast<(x: number, y: number) => number>();
        const result = empty(2, 3);
        
        expect(result).toEqual(undefined);
    });
   
   it("behaves transparently with single target", () => {
        const plus = multicast((x: number, y: number) => x + y);
          
        expect(plus(2, 4)).toEqual(6);
        expect(plus(4, 5)).toEqual(9);
   });
   
   it("returns final return value of multiple targets", () => {
        const wat = multicast<(x: number, y: number) => number>(
            (x, y) => x + y, 
            (x, y) => x * y);

        expect(wat(2, 4)).toEqual(8);
        expect(wat(4, 5)).toEqual(20);
   });
   
   it("is immutable", () => {
        
        type arith = (x: number, y: number) => number;
        
        const calls: number[] = [];
        
        const spy = (f: arith) => {
            const i = calls.length;
            calls.push(0);
            return (x: number, y: number) => {
                calls[i]++;
                return f(x, y);
            };
        };
        
        const plus = spy((x, y) => x + y),
              minus = spy((x, y) => x - y),
              times = spy((x, y) => x * y),
              divide = spy((x, y) => x / y);

        const m1 = multicast<arith>();
        expect(m1(6, 3)).toEqual(undefined);
        expect(calls).toEqual([0, 0, 0, 0]);
        
        const m2 = m1.add(plus);
        expect(m1(6, 3)).toEqual(undefined);
        expect(calls).toEqual([0, 0, 0, 0]);
        expect(m2(6, 3)).toEqual(9);
        expect(calls).toEqual([1, 0, 0, 0]);
        
        const m3 = m2.add(minus).add(times).add(divide);
        expect(m1(6, 3)).toEqual(undefined);
        expect(calls).toEqual([1, 0, 0, 0]);
        expect(m2(6, 3)).toEqual(9);
        expect(calls).toEqual([2, 0, 0, 0]);
        expect(m3(6, 3)).toEqual(2);
        expect(calls).toEqual([3, 1, 1, 1]);
        
        const m4 = m3.remove(times);
        expect(m1(6, 3)).toEqual(undefined);
        expect(calls).toEqual([3, 1, 1, 1]);
        expect(m2(6, 3)).toEqual(9);
        expect(calls).toEqual([4, 1, 1, 1]);
        expect(m3(6, 3)).toEqual(2);
        expect(calls).toEqual([5, 2, 2, 2]);
        expect(m4(6, 3)).toEqual(2);
        expect(calls).toEqual([6, 3, 2, 3]);
   });
});