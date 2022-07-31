import sys

if len(sys.argv) != 3:
    print("Usage: asm.py <input> <output>")
    exit()

# Read all lines into a list
lines = open(sys.argv[1]).readlines()
# Filter out blank lines and lines starting with '#'
lines = list(filter(lambda line: line and line[0] != '#', lines))
# Join all lines and split into tokens
tokens = ' '.join(lines).split()

# pluck labels and remember position
labels, i = {}, 0
while i < len(tokens):
    # If not a label, advance
    if tokens[i][-1] != ':':
        i += 1
        continue

    # Store location and pluck label
    labels[tokens[i][:-1]] = i
    tokens.pop(i)

# Op code list (constant)
OP_CODES = ['at', 'set', 'add', 'not', 'eq', 'jz', 'inp', 'out']

for i, token in enumerate(tokens):
    # replace label references with actual position
    if token[0] == ':':
        if '+' in token:
            base, offset = token.split('+')
            tokens[i] = labels[base[1:]] + int(offset)
        else:
            tokens[i] = labels[token[1:]]
    
    # replace op codes with values
    if token in OP_CODES:
        tokens[i] = OP_CODES.index(token)

    # replace ORD macro
    if token[:4] == 'ORD(':
        tokens[i] = ord(token[4:-1])

open(sys.argv[2], "w").write(
    ' '.join([str(token) for token in tokens]))
