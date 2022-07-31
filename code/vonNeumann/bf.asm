# Read Brainfuck program until a \n is encountered
START:
# Read one integer at PROG + offset I
inp :PROG :I
# Increment I by 1
add :I :CONST+1
# Zero out DONE_READING (!1)
not :DONE_READING :CONST+1
# DONE_READING = 10
add :DONE_READING :CONST+3
# Load the last integer we read in TEMP
at :TEMP :END
# Increment END to keep track of program end
add :END :CONST+1
# Check if the last integer we read was 10 (\n)
eq :DONE_READING :TEMP
# If it wasn't zero, jump to start and read another value
jz :DONE_READING :START 

# Start running program
BF_RUN:
at :TEMP :CODE_PTR
add :CODE_PTR :CONST+1

# Check if we're on a > instruction
not :TEMP2 :CONST+1
add :TEMP2 :BF
eq :TEMP2 :TEMP
not :TEMP2 :TEMP2
jz :TEMP2 :RIGHT

# Check if we're on a < instruction
not :TEMP2 :CONST+1
add :TEMP2 :BF+1
eq :TEMP2 :TEMP
not :TEMP2 :TEMP2
jz :TEMP2 :LEFT

# Check if we're on a + instruction
not :TEMP2 :CONST+1
add :TEMP2 :BF+2
eq :TEMP2 :TEMP
not :TEMP2 :TEMP2
jz :TEMP2 :INC

# Check if we're on a - instruction
not :TEMP2 :CONST+1
add :TEMP2 :BF+3
eq :TEMP2 :TEMP
not :TEMP2 :TEMP2
jz :TEMP2 :DEC

# Check if we're on a . instruction
not :TEMP2 :CONST+1
add :TEMP2 :BF+4
eq :TEMP2 :TEMP
not :TEMP2 :TEMP2
jz :TEMP2 :OUT

# Check if we're on a , instruction
not :TEMP2 :CONST+1
add :TEMP2 :BF+5
eq :TEMP2 :TEMP
not :TEMP2 :TEMP2
jz :TEMP2 :IN

# Check if we're on a [ instruction
not :TEMP2 :CONST+1
add :TEMP2 :BF+6
eq :TEMP2 :TEMP
not :TEMP2 :TEMP2
jz :TEMP2 :FORWARD

# Check if we're on a ] instruction
not :TEMP2 :CONST+1
add :TEMP2 :BF+7
eq :TEMP2 :TEMP
not :TEMP2 :TEMP2
jz :TEMP2 :BACKWARD

# No matching BF instruction so we're done
jz :CONST 10000

RIGHT:
# > - increment data pointer
add :DATA_PTR :CONST+1
jz :CONST :BF_RUN

LEFT:
# < - decrement data pointer
add :DATA_PTR :CONST+2
jz :CONST :BF_RUN

INC:
# + - increment cell
at :TEMP :DATA_PTR
add :TEMP :CONST+1
set :DATA_PTR :TEMP
jz :CONST :BF_RUN

DEC:
# - - decrement cell
at :TEMP :DATA_PTR
add :TEMP :CONST+2
set :DATA_PTR :TEMP
jz :CONST :BF_RUN

OUT:
# . - output cell
at :TEMP :DATA_PTR
out :TEMP :CONST
jz :CONST :BF_RUN

IN:
# , - store input in cell
inp :TEMP :CONST
set :DATA_PTR :TEMP
jz :CONST :BF_RUN

FORWARD:
# [
at :TEMP :DATA_PTR    
not :TEMP :TEMP
# If value in cell is not 0, continue
jz :TEMP :BF_RUN
# Find matching ]
# Set TEMP to 1, counting unbalanced [
not :TEMP :TEMP
add :TEMP :CONST+1
SCAN_FORWARD:
at :TEMP2 :CODE_PTR
eq :TEMP2 :BF+6
not :TEMP2 :TEMP2
# Jump if found a [
jz :TEMP2 :FORWARD_LPAR
at :TEMP2 :CODE_PTR
eq :TEMP2 :BF+7
not :TEMP2 :TEMP2
# Jump if found a ]
jz :TEMP2 :FORWARD_RPAR
# Keep scanning
add :CODE_PTR :CONST+1
jz :CONST :SCAN_FORWARD
# Increment counter when finding a [
FORWARD_LPAR:
add :TEMP :CONST+1
add :CODE_PTR :CONST+1
jz :CONST :SCAN_FORWARD
# Decrement counter when finding a ]
FORWARD_RPAR:
add :TEMP :CONST+2
# If counter is 0, we're done
jz :TEMP :BF_RUN
# Else keep scanning
add :CODE_PTR :CONST+1
jz :CONST :SCAN_FORWARD

BACKWARD:
# ]
at :TEMP :DATA_PTR    
# If value in cell is 0, continue
jz :TEMP :BF_RUN
# Find matching [
# Set TEMP to 1, counting unbalanced ]
not :TEMP :TEMP
add :TEMP :CONST+1
# Move code pointer back 2
add :CODE_PTR :CONST+2
add :CODE_PTR :CONST+2
SCAN_BACKWARD:
at :TEMP2 :CODE_PTR
eq :TEMP2 :BF+6
not :TEMP2 :TEMP2
# Jump if found a [
jz :TEMP2 :BACKWARD_LPAR
at :TEMP2 :CODE_PTR
eq :TEMP2 :BF+7
not :TEMP2 :TEMP2
# Jump if found a ]
jz :TEMP2 :BACKWARD_RPAR
# Keep scanning
add :CODE_PTR :CONST+2
jz :CONST :SCAN_BACKWARD
# Decrement counter when finding a [
BACKWARD_LPAR:
add :TEMP :CONST+2
# If counter is 0, we're done
jz :TEMP :BF_RUN
# Else keep scanning
add :CODE_PTR :CONST+2
jz :CONST :SCAN_BACKWARD
# Increment counter when finding a ]
BACKWARD_RPAR:
add :TEMP :CONST+1
add :CODE_PTR :CONST+2
jz :CONST :SCAN_BACKWARD

CONST: 0 1 -1 10 
BF: ORD(>) ORD(<) ORD(+) ORD(-) ORD(.) ORD(,) ORD([) ORD(])
I: 0
TEMP: 0
TEMP2: 0
END: :PROG
DONE_READING: 0
CODE_PTR: :PROG
DATA_PTR: 5000

# We'll load the BF program here
PROG:
