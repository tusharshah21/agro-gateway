#
# ! Use connect-flash

# *Reverse String
s = ["h", "e", "l", "l", "o"]


def reverse1(s):
    return s[::-1]


def reverse2(s):
    l, r = 0, len(s) - 1
    while l < r:
        s[l], s[r] = s[r], s[l]
        l += 1
        r -= 1
    return s


print(reverse1(s))
print(reverse2(s))
