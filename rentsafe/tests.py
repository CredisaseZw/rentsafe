target = 9
list_set = [3,2,8,5,0,1]

def find_nums_to_sum_to_target(target_num, list_items):
    search_dict = {}
    for i, num in enumerate(list_items):
        if target_num - num in search_dict:
            nums_to_add =[num, target_num - num, 'index1:', i, 'index2:', search_dict[target_num - num]]
            print(nums_to_add)
            return nums_to_add
        search_dict[num] = i
        

def bermuda(n):
    for i in range(n,):
        print("*" * i)

a = bermuda(5)

