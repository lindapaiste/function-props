/**
 * note: function resolveProp, isPlainValue, and isFunctionProp will all yield unexpected behavior if the resolved type
 * T itself is a function
 */

/**
 * The type MaybeFunction represents a value which can be of the expected return type T, or can be a function which
 * returns T when called with a single argument A (often a props object)
 */
export type MaybeFunction<T, A> = T | ((args: A) => T)

/**
 * Infers the value of generic A, the function arguments, from a MaybeFunction type
 */
export type Args<T extends MaybeFunction<any, any>> = T extends MaybeFunction<any, infer A> ? A : never

/**
 * Infers the value of generic T, the resolved value of the function, from a MaybeFunction type
 */
export type Value<T extends MaybeFunction<any, any>> = T extends MaybeFunction<infer A, any> ? A : never

/**
 * Type check sees whether the prop is a value rather than a function
 */
export const isPlainValue = <T extends MaybeFunction<any, any>>(prop: T): prop is Value<T> => {
    return typeof prop !== "function";
}

/**
 * When presented with a MaybeFunction prop, call "resolveProp" with the prop and the args to return a parsed value.
 * If the prop is already a plain value it will simply be returned, and if it is a function it will be called and it's
 * return value will be returned.
 */
export const resolveProp = <T extends MaybeFunction<any, any>>(prop: T, args: Args<T>): Value<T> => {
    return typeof prop === "function" ? prop(args) : prop;
}

/**
 * Type utility takes an object T which contains multiple values, some of which are MaybeFunctions and others which are
 * normal props, and replaces all MaybeFunctions with their resolved versions
 */
export type Resolved<T> = {
    [P in keyof T]: T[P] extends MaybeFunction<any, infer R> ? R : T[P];
}

/**
 * can resolve multiple props at once, but only if all function props take the same arguments. USE CAREFULLY. Will
 * cause problems with props like onClick, etc.
 */
export const resolveAll = <P extends {}, A>(props: P, args: A): Resolved<P> => {
    return Object.entries(props)
        .map(([key, value]) => ([key, resolveProp(value, args)]))
        .reduce((obj, [key, value]) => ({...obj, [key as keyof P]: value}), {}) as Resolved<P>;
};
