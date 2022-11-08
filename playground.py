# # # # # #
# # # # # # ! Use connect-flash

# # # # # # *Reverse String
# # s = ["h", "e", "l", "l", "o"]
# # s.reverse()


# # # # # def reverse1(s):
# # # # #     return s[::-1]


# # # # # def reverse2(s):
# # # # #     l, r = 0, len(s) - 1
# # # # #     while l < r:
# # # # #         s[l], s[r] = s[r], s[l]
# # # # #         l += 1
# # # # #         r -= 1
# # # # #     return s


# # # # # print(reverse1(s))
# # # # # print(reverse2(s))


# # # # # find prime numbers

# # # # # def is_prime(n):

# # # # # Linear search Algorithm:

# # # # import time

# # # # # def find_num(n, s):
# # # # #     for i in range(len(s)):
# # # # #         if s[i] == n:
# # # # #             return f"Number {n} at index {i}"
# # # # #     return f"Number {n} not found"


# # # # n = 13
# # # # s = [1, 8, 32, 91, 5, 15, 9, 100, 3]
# # # # # print(find_num(0, s))


# # # # def find_num(n, s):
# # # #     for i in s:
# # # #         if i == n:
# # # #             return True
# # # #     return False


# # # # start = time.time()
# # # # print(find_num(9, s))
# # # # end = time.time() - start

# # # # start2 = time.time()
# # # # print(9 in s)
# # # # end2 = time.time() - start2

# # # # print(
# # # #     f"""
# # # # {end}
# # # # {end2}
# # # # """
# # # # )

# # # # Binary Search

# s = [1, 8, 32, 91, 5, 15, 9, 100, 3]
# s = sorted(s)
# print(s)

# # # def binary_search(s, n):
# # #     s = sorted(s)
# # #     print(s)
# # #     l, r = 0, len(s) - 1
# # #     while r >= l:
# # #         mid = (l + r) // 2
# # #         if s[mid] == n:
# # #             return True
# # #         else:
# # #             if n < r:
# # #                 r = mid - 1
# # #             else:
# # #                 l = mid + 1
# # #     return False


# # # print(binary_search(s, 91))

# from bisect import bisect_left

# # # print(bisect_left(s, 98))


# def binary_search(a_list, target):
#     index = bisect_left(a_list, target)
#     print(index)
#     if index <= len(a_list) - 1 and a_list[index] == target:
#         return True
#     return False


# print(binary_search(s, 100))

# # a = 300
# # b = 300
# # print(a is b)
