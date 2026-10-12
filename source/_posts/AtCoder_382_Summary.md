---
title: 'AtCoder Beginner Contest 382 Summary'
slug: 'AtCoder_382_Summary'
date: '2024-12-02 18:46:52'
article_lang: 'zh'
summary: '本文是 AtCoder Beginner Conteset（ABC）382 的总结笔记。'
categories:
  - '编程'
tags:
  - 'Algorithm'
  - 'Programming Contest'
  - 'AtCoder'
  - 'ABC'
cover: 'https://my-markdown-picture-bedding.oss-ap-northeast-1.aliyuncs.com/uPic/2024-12-11/Cover_AtCoder.jpeg'
---

本文是 AtCoder Beginner Conteset（ABC）382 的总结笔记。

<!-- more -->

# **A - Daily Cookie**

Problem：[A - Daily Cookie](https://atcoder.jp/contests/abc382/tasks/abc382_a)

省略。

# **B - Daily Cookie 2**

Problem：[B - Daily Cookie 2](https://atcoder.jp/contests/abc382/tasks/abc382_b)

把字符串 $S$ 后面的 $k$ 个`@`改成 `.` 输出。

```c++
// Problem: https://atcoder.jp/contests/abc382/tasks/abc382_b

#include <bits/stdc++.h>
using namespace std;
typedef long long LL;
typedef pair<int, int> PII;

void solve() {
    int n, k;
    cin >> n >> k;
    string s;
    cin >> s;
    for (int i = n - 1; i >= 0; i--) {
        if (!k)
            break;
        if (s[i] == '@') {
            k--;
            s[i] = '.';
        }
    }

    cout << s << endl;
}

int main() {
    cin.tie(0);
    ios_base::sync_with_stdio(false);
    solve();
    return 0;
}
```

# **C - Kaiten Sushi**

Problem：[C - Kaiten Sushi](https://atcoder.jp/contests/abc382/tasks/abc382_c)

贪心。

## 题目：

有编号 $1 \sim N$ 的 $N$ 个人，每个人有阈值 $A_i$，只吃超过阈值的食物。

有 $1\sim M$ 的 $M$ 份寿司，每个寿司有美味度 $B_j$，依次经过上面的每个人。只要美味度高于这个人，就会被这个人吃掉。

输出每份寿司被谁吃掉。

## 思路：

对于 $A$ 来说，只要是高于它阈值的寿司，都会被吃掉。所以将所有寿司按照降序排列，从头开始遍历 $A$ 的各个人即可。

```c++
// Problem: https://atcoder.jp/contests/abc382/tasks/abc382_c

#include <bits/stdc++.h>
using namespace std;
typedef long long LL;
typedef pair<int, int> PII;

const int N = 2e5 + 10;
int n, m;
int A[N];
PII B[N];    // 存储食物美味度 和 食物编号
int res[N];  // 存储每个食物分给了谁

// 降序排列
bool cmp(const PII& a, const PII& b) {
    return a.first > b.first;
}

void solve() {
    // 读入数据
    cin >> n >> m;
    for (int i = 0; i < n; i++)
        cin >> A[i];
    for (int i = 0; i < m; i++) {
        cin >> B[i].first;  // 食物美味度
        B[i].second = i;    // 食物编号
    }

    sort(B, B + m, cmp);          // 降序排列
    memset(res, -1, sizeof res);  // res 初始化

    for (int i = 0, index = 0; i < n; i++) {
        // 只要 接受值 小于等于 食物美味度，就吃掉
        // index 如果超出 m 了，食物美味度就是 0，不影响后面的判断，不算越界
        while (A[i] <= B[index].first) {
            res[B[index].second] = i + 1;
            index++;
        }
    }

    // 输出结果
    for (int i = 0; i < m; i++)
        cout << res[i] << endl;
}

int main() {
    cin.tie(0);
    ios_base::sync_with_stdio(false);
    solve();
    return 0;
}
```

# **D - Keep Distance**

Problem：[D - Keep Distance](https://atcoder.jp/contests/abc382/tasks/abc382_d)

DFS + 剪枝

## 题目：

打印长度为 $N$ 并满足下面两个条件的字典序序列 $A$：

- $1 \leq A_i$

- $A_{i - 1} + 10 \leq A_i$
- $A_N \leq M$

## 思路：

题目中有个重要的约束条件：**前一个数 $A_{i-1}$ 与后一个数 $A_i$ 距离相差 $10$ 以上。**

利用这个约束条件可以剪枝 DFS 的递归过程，大大减少时间复杂度。

```c++
// Problem: https://atcoder.jp/contests/abc382/tasks/abc382_d

#include <bits/stdc++.h>
using namespace std;
typedef long long LL;
typedef pair<int, int> PII;

int n, m;
vector<vector<int>> res;
vector<int> temp;

void dfs(int x, int u) {
    // 当前序列长度达到n时
    if (u == n) {
        res.push_back(temp);  // 保存当前解
        return;
    }

    // 超出界限，直接返回
    if (x > m)
        return;

    // 从x+10开始遍历，确保相邻数字差值至少为10
    for (int i = x + 10; i <= m - 10 * (n - 1 - u); i++) {
        temp.push_back(i);
        dfs(i, u + 1);
        temp.pop_back();
    }
}

void solve() {
    cin >> n >> m;

    // 从1开始遍历数列 A 的第一个可能数字
    for (int i = 1; i <= m - 10 * (n - 1); i++) {
        temp.push_back(i);
        dfs(i, 1);  // 已经放入一个数，所以u从1开始
        temp.pop_back();
    }

    // 输出每一组解
    cout << res.size() << endl;
    for (auto& x : res) {
        for (auto t : x)
            cout << t << " ";
        cout << endl;
    }
}

int main() {
    cin.tie(0);
    ios_base::sync_with_stdio(false);
    solve();
    return 0;
}

```

# **E - Expansion Packs**

Problem：[E - Expansion Packs](https://atcoder.jp/contests/abc382/tasks/abc382_e)

概率题

## 题目：

有无限个口袋，每个口袋里有 $N$ 张卡片。第 $i$ 张卡片位稀有卡的概率为 $P_i$。

一个个打开口袋。求累计获得 $X$ 张稀有卡的时候，打开口袋的期望值。

## 限制条件：

$1 \leq N \leq 5000$

$1 \leq X \leq 5000$

$1 \leq P_i \leq 100$

## 思路：

TODO
