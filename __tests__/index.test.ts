import {MaybeFunction, resolveProp, isPlainValue, resolveAll} from "../src";

test("can generate return values", () => {
    const funcProp: MaybeFunction<number, string> = (s: string) => s.length;
    const valueProp: MaybeFunction<number, string> = 5;

    const args = "hello world";

    // value prop should return itself
    expect( resolveProp(valueProp, "hello world") ).toBe(5);
    // function prop should call itself
    expect( resolveProp(funcProp, "hello world") ).toBe(11);

    expect( isPlainValue(funcProp)).toBe( false );
    expect( isPlainValue(valueProp)).toBe( true );

    // resolve a props object with two functions returning different types, but both take the same args
    const props = {
        length: (s: string) => s.length,
        uppercase: (s: string) => s.toUpperCase(),
        something: "else",
        number: 3,
    };

    const resolved = resolveAll(props, "hello world");

    expect(resolved.length).toBe( 11);
    expect(resolved.uppercase).toBe( "HELLO WORLD");
    expect(resolved.something).toBe( "else");
    expect(resolved.number).toBe( 3);

})
