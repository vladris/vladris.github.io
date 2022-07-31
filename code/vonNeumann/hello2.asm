# Beginning of loop
LOOP: 
# Output I
out :DATA :I
# Decrement COUNTER, increment I
add :COUNTER :CONST+2
add :I :CONST+1
# If COUNTER is 0, we're done
jz :COUNTER 10000
# If not, jump to the start of the loop
jz :CONST :LOOP

# Constants
CONST: 0 1 -1

# Data
DATA: ORD(H) ORD(e) ORD(l) ORD(l) ORD(o) 10

# Variables
I: 0
COUNTER: 6
