import time

text = "Hello World"

i = 0
while True:
    time.sleep(1)
    print(text[i])
    i += 1
    if i >= len(text):
        i = 0