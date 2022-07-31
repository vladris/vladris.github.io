def inp(file):
    buffer = list(open(file).read())
    return lambda: ord(buffer.pop(0))

def out(value):
    print(chr(value), end='')

def memory(file):
    memory = [0] * 10000
    for i, value in enumerate(' '.join(open(file).readlines()).split()):
        memory[i] = int(value)
    return memory

class CPU:
    def __init__(self, memory, inp, out):
        self.memory, self.inp, self.out = memory, inp, out

    def run(self):
        self.pc = 0
        while self.pc < len(self.memory):
            instr, m1, m2 = self.memory[self.pc:self.pc + 3]
            self.process(instr, m1, m2)
            self.pc += 3

    def process(self, instr, m1, m2):
        match instr:
            case 0: # AT
                self.memory[m1] = self.memory[self.memory[m2]]
            case 1: # SET
                self.memory[self.memory[m1]] = self.memory[m2]
            case 2: # ADD
                self.memory[m1] += self.memory[m2]
            case 3: # NOT
                self.memory[m1] = +(not self.memory[m2])
            case 4: # EQ
                self.memory[m1] = +(self.memory[m1] == self.memory[m2])
            case 5: # JZ
                if not self.memory[m1]:
                    # Set PC to m2 - 3 since run() will increment PC by 3
                    self.pc = m2 - 3
            case 6: # INP
                self.memory[m1 + self.memory[m2]] = self.inp()
            case 7: # OUT
                out(self.memory[m1 + self.memory[m2]])
            case _: 
                raise Exception("Unknown instruction")
    
import sys

vn = CPU(memory(sys.argv[1]), inp(sys.argv[2]), out)
vn.run()
