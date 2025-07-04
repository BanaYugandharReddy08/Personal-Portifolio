const defaultProblems = [
  {
    id: '1',
    title: 'Two Sum',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/two-sum/',
    notes: 'Hash map for O(n) solution.',
    statement: 'Return the indices of the two numbers that add up to the target.',
    dateSolved: '2024-01-01T00:00:00.000Z',
    solution: {
      javascript: "function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    if (map.has(target - nums[i])) return [map.get(target - nums[i]), i];\n    map.set(nums[i], i);\n  }\n}",
      python: "class Solution:\n    def twoSum(self, nums, target):\n        lookup = {}\n        for i, num in enumerate(nums):\n            if target - num in lookup:\n                return [lookup[target - num], i]\n            lookup[num] = i"
    }
  },
  {
    id: '2',
    title: 'Add Two Numbers',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/add-two-numbers/',
    notes: 'Linked list addition handling carry.',
    statement: 'Add two numbers represented by linked lists and return the sum as a list.',
    dateSolved: '2024-01-02T00:00:00.000Z',
    solution: {
      javascript: "var addTwoNumbers = function(l1, l2) {\n  let dummy = new ListNode();\n  let cur = dummy;\n  let carry = 0;\n  while (l1 || l2 || carry) {\n    let sum = (l1?.val || 0) + (l2?.val || 0) + carry;\n    carry = Math.floor(sum / 10);\n    cur.next = new ListNode(sum % 10);\n    cur = cur.next;\n    l1 = l1?.next;\n    l2 = l2?.next;\n  }\n  return dummy.next;\n};",
      python: "class Solution:\n    def addTwoNumbers(self, l1, l2):\n        dummy = ListNode(0)\n        cur = dummy\n        carry = 0\n        while l1 or l2 or carry:\n            sum = (l1.val if l1 else 0) + (l2.val if l2 else 0) + carry\n            carry = sum // 10\n            cur.next = ListNode(sum % 10)\n            cur = cur.next\n            l1 = l1.next if l1 else None\n            l2 = l2.next if l2 else None\n        return dummy.next"
    }
  },
  {
    id: '3',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    notes: 'Sliding window with set.',
    statement: 'Find the length of the longest substring without repeating characters.',
    dateSolved: '2024-01-03T00:00:00.000Z',
    solution: {
      javascript: "var lengthOfLongestSubstring = function(s) {\n  let set = new Set();\n  let left = 0, res = 0;\n  for (let right = 0; right < s.length; right++) {\n    while (set.has(s[right])) {\n      set.delete(s[left]);\n      left++;\n    }\n    set.add(s[right]);\n    res = Math.max(res, right - left + 1);\n  }\n  return res;\n};",
      python: "class Solution:\n    def lengthOfLongestSubstring(self, s):\n        chars = set()\n        left = 0\n        res = 0\n        for right, c in enumerate(s):\n            while c in chars:\n                chars.remove(s[left])\n                left += 1\n            chars.add(c)\n            res = max(res, right - left + 1)\n        return res"
    }
  }
];

export default defaultProblems;
