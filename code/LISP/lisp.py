import re


def lex(line):
    return [match.group() for match in re.finditer('\(|\)|\w+', line)]


def atom(value):
    try:
        return int(value)
    except:
        return value


def pop_rpar(tokens):
    while tokens[0] != ')':
        yield
    tokens.pop(0)


def parse(tokens):
    match token := tokens.pop(0):
        case '(':
            return [parse(tokens) for _ in pop_rpar(tokens)]
        case ')':
            raise Exception('Unexpected )')
        case _:
            return atom(token)


env = {
    # Equality
    'eq': lambda arg1, arg2: arg1 == arg2,

    # Arithmetic
    'add': lambda arg1, arg2: arg1 + arg2,
    'sub': lambda arg1, arg2: arg1 - arg2,
    'mul': lambda arg1, arg2: arg1 * arg2,
    'div': lambda arg1, arg2: arg1 / arg2,

    # Lists
    'cons': lambda car, cdr: [car] + cdr,
    'car': lambda list: list[0],
    'cdr': lambda list: list[1:],
}


def make_function(params, body, env):
    return lambda *args: eval(body, env | dict(zip(params, args)))


def eval(sexpr, env=env):
    # If null or number atom, return it
    if sexpr == [] or isinstance(sexpr, int):
        return sexpr

    # If string atom, look it up in environment
    if isinstance(sexpr, str):
        return env[sexpr]

    match sexpr[0]:
        case 'def':
            env[sexpr[1]] = eval(sexpr[2], env)
        case 'deffun':
            env[sexpr[1]] = make_function(sexpr[2], sexpr[3], env)
        case 'quote':
            return sexpr[1]
        case 'if':
            return eval(sexpr[2], env) if eval(sexpr[1], env) else eval(sexpr[3], env)
        case call:
            return env[call](*[eval(arg, env) for arg in sexpr[1:]])


while line := input('> '):
    try:
        print(eval(parse(lex(line))))
    except Exception as e:
        print(f'{type(e).__name__}: {e}')
