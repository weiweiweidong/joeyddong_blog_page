---
title: 'AtCoder Beginner Contest 393 Summary'
slug: 'AtCoder_393_Summary'
date: '2025-02-17 23:21:44'
article_lang: 'zh'
summary: '本文是 AtCoder Beginner Conteset（ABC）393 的总结笔记。'
categories:
  - '编程'
tags:
  - 'Algorithm'
  - 'Programming Contest'
  - 'AtCoder'
  - 'ABC'
cover: 'https://my-markdown-picture-bedding.oss-ap-northeast-1.aliyuncs.com/uPic/2024-12-11/Cover_AtCoder.jpeg'
---

本文是 AtCoder Beginner Conteset（ABC）393 的总结笔记。

<!-- more -->
# **A - Poisonous Oyster**

Problem：[A - Poisonous Oyster](https://atcoder.jp/contests/abc393/tasks/abc393_a)

题目非常的简单。

```c++
// Problem: https://atcoder.jp/contests/abc393/tasks/abc393_a

#include <bits/stdc++.h>
using namespace std;
typedef long long LL;
typedef pair<int, int> PII;

string a, b;

void solve() {
    cin >> a >> b;
    if (a == "sick" && b == "fine")
        cout << 2 << endl;
    else if (a == "fine" && b == "sick")
        cout << 3 << endl;
    else if (a == "sick" && b == "sick")
        cout << 1 << endl;
    else
        cout << 4 << endl;
}

int main() {
    cin.tie(0);
    ios_base::sync_with_stdio(false);
    solve();
    return 0;
}
```

# **B - A..B..C**

Problem：[B - A..B..C](https://atcoder.jp/contests/abc393/tasks/abc393_b)

题目非常的简单。

```c++
// Problem: https://atcoder.jp/contests/abc393/tasks/abc393_b

#include <bits/stdc++.h>
using namespace std;
typedef long long LL;
typedef pair<int, int> PII;

string s;
int res;

void solve() {
    cin >> s;

    for (int i = 0; i < s.size(); i++) {
        if (s[i] == 'A') {
            for (int j = i + 1; j < s.size(); j++) {
                if (s[j] == 'B') {
                    for (int k = j + 1; k < s.size(); k++) {
                        if (s[k] == 'C' && k - j == j - i)
                            res++;
                    }
                }
            }
        }
    }

    cout << res << endl;
}

int main() {
    cin.tie(0);
    ios_base::sync_with_stdio(false);
    solve();
    return 0;
}
```

# **C - Make it Simple**

Problem：[C - Make it Simple](https://atcoder.jp/contests/abc393/tasks/abc393_c)

题目非常的简单。题目本质上是要去除所有的重边和自环。

```c++
// Problem: https://atcoder.jp/contests/abc393/tasks/abc393_c

#include <bits/stdc++.h>
using namespace std;
typedef long long LL;
typedef pair<int, int> PII;

int n, m;
int a, b;
set<PII> s;

void solve() {
    cin >> n >> m;
    for (int i = 0; i < m; i++) {
        cin >> a >> b;
        if (a == b)
            continue;
        if (a < b)
            swap(a, b);
        s.insert({a, b});
    }

    cout << m - s.size() << endl;
}

int main() {
    cin.tie(0);
    ios_base::sync_with_stdio(false);
    solve();
    return 0;
}
```

# **D - Swap to Gather**

Problem：[D - Swap to Gather](https://atcoder.jp/contests/abc393/tasks/abc393_d)

## 题目：

只由 `0` 或 `1` 组成的长度为 $N$ 的字符串 $S$。

执行下面操作若干次（也可以不执行）：

- 将 `i` 与 `i+1` 字符相交换

要将 $S$ 中所有的 `1` 都连成一串，求最小操作次数。

## 约束条件：

$2 \leq N \leq 5 \times 10^5$

## 思路：

根据 N 的约束条件，实际上能知道，本题的时间复杂度应该是 n 或者 nlogn。再高的话肯定会超时。

### 思路 1：从 0 的角度来看

考虑某一个 0：

如果左侧的 1 比较少，那么就应该把它移到所有 1 的左侧；如果它右侧的 1 比较少，就应该将其移动到右侧所有 1 的右侧。

因此对于每个 0，它的代价都是：`min(左侧 1 的个数，右侧 1 的个数)`

答案就是所有 0 的代价之和。

时间复杂度为 $O(N)$

```c++
// Problem: https://atcoder.jp/contests/abc393/tasks/abc393_d

#include <bits/stdc++.h>
using namespace std;
typedef long long LL;
typedef pair<int, int> PII;

int n;
string s;

void solve() {
    cin >> n >> s;
    // 预处理一下总共有多少 1
    int tot_1 = 0;
    for (auto x : s)
        tot_1 += (x == '1');

    LL res = 0;
    int left = 0;  // 左侧有多少 1
    for (char c : s)
        // 如果遇到 0
        if (c == '0')
            res += min(left, tot_1 - left);
        // 如果遇到 1
        else
            left++;

    // 输出结果
    cout << res << endl;
}

int main() {
    cin.tie(0);
    ios_base::sync_with_stdio(false);
    solve();
    return 0;
}
```

### 思路 2：从 1 的角度来看

假设最后连续的 `1`，位于 `[L, L+M-1]` 这一段（其中 $M$ 是 `1` 的总数）。

那么我们应该把最左侧的 `1` 移动到 `L` 处，第二靠左的 `1` 移动到 `L+1` 处。

那么总代价记为： $\sum_{i=1}^{M}|(a_i - (L+i-1))|$，其中 $a_i$ 是第 `i` 个 `1` 的原本的位置。

把上面的总代价的公式稍微转化一下，变成 $\sum_{i=1}^{M}|(a_i - i) - (L-1)|$

令 $b_i = a_i - i$， $x = L - 1$，总代价公式就转化为 $\sum_{i=1}^{M}|b_i - x|$。

这个问题就转化为了：**数轴上有 $b_1... b_M$ 这些点，找出一个点 x，使其到所有点的距离之和最小。**这是一个经典的问题。这个点 x 应该位于 $b_1... b_M$ 的**中位数**处。

时间复杂度为 $O(n\log n)$。

```c++
// Problem: https://atcoder.jp/contests/abc393/tasks/abc393_d

#include <bits/stdc++.h>
using namespace std;
typedef long long LL;
typedef pair<int, int> PII;

int n;
string s;
vector<int> b;

void solve() {
    cin >> n >> s;

    // 找出所有 1 的位置，并计算 b_i 的值
    int i = 0;  // 记录这是出现的第几个 1
    for (int j = 0; j < s.size(); j++)
        if (s[j] == '1') {
            i += 1;              // 遇到'1'的时候，计数+1
            b.push_back(j - i);  // 存储 b_i 的值
        }

    sort(b.begin(), b.end());  // 排序
    int x = b[b.size() / 2];  // 求中位数（如果是偶数个，中间两个任取一个）

    // 开始计算总代价
    LL res = 0;
    for (int bi : b)
        res += abs(bi - x);

    // 输出结果
    cout << res << endl;
}

int main() {
    cin.tie(0);
    ios_base::sync_with_stdio(false);
    solve();
    return 0;
}
```

# **E - GCD of Subset**

Problem：[E - GCD of Subset](https://atcoder.jp/contests/abc393/tasks/abc393_e)

## 题目：

给定长度为 $N$ 的序列 $(A_1 , ...,A_N)$ 和 一个正整数 $K$

针对每一个 $i = 1,2,...,N$，求解下面问题：

- 从 $A$ 中选择包含 $A_i$ 的 $K$ 个元素，求所选元素的最大公约数 GCD

## 约束条件：

$1 \leq K \leq N \leq 1.2 \times 10^6$

$1 \leq A_i \leq 10^6$

## 思路：

从约束条件得到的提示：从N 给定的范围来看，这道题的时间复杂度应该是$O(N)$ 或者 $O(N\log N)$ 才能满足条件。

假设现在给定 $i$，那么答案应该是多少？考虑数字 $d$ 能够成为最后的答案，那么需要 $d$ 满足下面条件：

- $d | A_i$ (表示 `A_i % d == 0`)
- 除了 $A_i$ 以外，$A$ 中至少有 $K$ 个数字是 $d$ 的倍数

先考虑如何统计每个数字的倍数的个数：

假设 `cnt[x]` 代表 $A$ 中 $x$ 的出现的次数；`mult[x]` 代表 $A$ 中 $x$ 的倍数的个数，那么 `mult[x] = cnt[x] + cnt[2x] + cnt[3x] +…..`。这一步的时间复杂度是 `N + N/2 + N/3 + N/4 + …… + N/N = NlnN`  （调和级数）

接下来考虑每个满足 `mult[d] >= K` 的 $d$，这个 $d$ 可以成为所有是 $d$ 的倍数的 $A_i$ 的答案。这一步也可以使用刚刚的循环来解决。

```c++
// Problem: https://atcoder.jp/contests/abc393/tasks/abc393_e

#include <bits/stdc++.h>
using namespace std;
typedef long long LL;
typedef pair<int, int> PII;

const int N = 1.2e6 + 10;

int n, k;
int a[N];
int cnt[N];   // 记录每个数字在 a 中出现的次数
int mult[N];  // 记录 a 中 x 的倍数的个数
int res[N];   // 记录每个数字对应的最大公约数

void solve() {
    // 读取数据，同时记录每个数字出现的次数
    cin >> n >> k;
    for (int i = 1; i <= n; i++) {
        cin >> a[i];
        cnt[a[i]] += 1;
    }

    // 对于每一个数字x，记录数字x的倍数在 a 中出现了多少次
    for (int x = 1; x < N; x++)
        for (int y = x; y < N; y += x)
            mult[x] += cnt[y];

    // 对于每一个数字 d，如果 d 的倍数在 a 中出现的次数超过 k 次
    // 说明 d 可以是所有 d 的倍数的 ai 的答案
    for (int d = 1; d < N; d++) {
        if (mult[d] < k)
            continue;
        for (int ai = d; ai < N; ai += d)
            res[ai] = max(res[ai], d);
    }

    // 最后输出每一个 ai 对应的结果
    for (int i = 1; i <= n; i++)
        cout << res[a[i]] << endl;
}

int main() {
    cin.tie(0);
    ios_base::sync_with_stdio(false);
    solve();
    return 0;
}
```

# **F - Prefix LIS Query**

Problem：[F - Prefix LIS Query](https://atcoder.jp/contests/abc393/tasks/abc393_f)

（但是这道题我还没有完全弄懂）

## 题目：

给定一个长度为 $N$ 的序列 $(A_1 , A_2 , ... , A_N)$

回答 $Q$ 个查询：

- 给定整数 $R_i$ 和 $X_i$ ，考虑 $(A_1 , A_2 , …., A_{R_i})$ 的一个子序列，不一定连续，但严格递增，并且元素最大值为 $X_i$ 。求子序列的最大可能长度。 保证 $X_i \geq \min\lbrace A_1, A_2,\dots,A_{R_i} \rbrace$

## 约束条件：

$1 \leq N,Q \leq 2 \times 10^5$

$1 \leq A_i \leq 10^9$

$1 \leq R_i \leq N$

$\min\lbrace A_1, A_2,\dots,A_{R_i} \rbrace\leq X_i\leq 10^9$

## 思路：

### 前置知识：LIS 问题的经典做法：

LIS（最长上升子序列）问题有一个经典的做法：使用树状数组。

dp[j] 表示到当前为止，以 j 结尾的最长上升子序列的长度。

按照 i = 1-> N 的顺序处理每个 a[i] 

更新方式：dp[a[i]] = max( k < a[i] , dp[k] )  + 1

这是经典的 “单点修改，区间求 max ”的问题，就可以使用树状数组解决。

### 本题思路：

#### 解法 1：使用树状数组

由于本题是个离线问题，所以可以把询问的顺序任意打乱。

考虑先将所有的询问按照 R 排序，再依次处理。每次我们处理完 a[i] 之后，就处理所有的 R=i 的询问。

处理 X = x 的询问时候，在树状数组中，找到 1~X 所对应的最大值就可以了。

注意：由于 A_i 的取值范围非常的大，所以要预先离散化。

```c++
// Problem: https://atcoder.jp/contests/abc393/tasks/abc393_f

#include <bits/stdc++.h>
using namespace std;
typedef long long LL;
typedef pair<int, int> PII;

const int N = 2e5 + 10;

int n, q;
int a[N];
struct Query {
    int x, id;
};
vector<Query> qs[N];

// 处理离散化
void disc() {
    vector<int> all_nums;
    for (int i = 1; i <= n; i++)
        all_nums.push_back(a[i]);
    for (int i = 1; i <= n; i++)
        for (Query q : qs[i])
            all_nums.push_back(q.x);
    sort(all_nums.begin(), all_nums.end());
    all_nums.resize(unique(all_nums.begin(), all_nums.end()) -
                    all_nums.begin());
    for (int i = 1; i <= n; i++)
        a[i] = lower_bound(all_nums.begin(), all_nums.end(), a[i]) -
               all_nums.begin() + 1;
    for (int i = 1; i <= n; i++)
        for (Query& q : qs[i])
            q.x = lower_bound(all_nums.begin(), all_nums.end(), q.x) -
                  all_nums.begin() + 1;
}

struct BIT {
    int a[N * 2];

    int lowbit(int x) { return x & -x; }
    void update(int pos, int v) {
        for (; pos < N * 2; pos += lowbit(pos))
            a[pos] = max(a[pos], v);
    }
    int get_max(int pos) {
        int res = 0;
        for (; pos; pos -= lowbit(pos))
            res = max(res, a[pos]);
        return res;
    }
};
BIT bit;
int res[N];

void solve() {
    cin >> n >> q;
    for (int i = 1; i <= n; i++)
        cin >> a[i];

    for (int i = 1; i <= q; i++) {
        int r, x;
        cin >> r >> x;
        qs[r].push_back({x, i});
    }

    disc();
    for (int i = 1; i <= n; i++) {
        int cur_ai_res = bit.get_max(a[i] - 1) + 1;
        bit.update(a[i], cur_ai_res);

        for (Query q : qs[i]) {
            res[q.id] = bit.get_max(q.x);
        }
    }

    for (int i = 1; i <= q; i++)
        cout << res[i] << endl;
}

int main() {
    cin.tie(0);
    ios_base::sync_with_stdio(false);
    solve();
    return 0;
}
```

#### 解法 2：使用 DP

```c++
// Problem: https://atcoder.jp/contests/abc393/tasks/abc393_f

#include <bits/stdc++.h>
using namespace std;
typedef long long LL;
typedef pair<int, int> PII;

const int INF = 1e9 + 10;

void solve() {
    int n, q;
    cin >> n >> q;

    // 读入原数组数据
    vector<int> a(n);
    for (int& i : a)
        cin >> i;

    // 存储所有的查询
    vector<vector<PII>> qs(n);
    for (int i = 0; i < q; i++) {
        int r, x;
        cin >> r >> x;
        qs[--r].emplace_back(i, x);
    }

    vector<int> res(q);
    vector<int> dp(n, INF);

    for (int i = 0; i < n; i++) {
        // 找到dp数组中第一个大于等于a[i]的位置
        auto it = lower_bound(dp.begin(), dp.end(), a[i]);
        *it = a[i];  // 更新该位置的值为a[i]

        // 处理所有询问位置为 i 的查询
        for (auto [id, x] : qs[i])
            // 计算dp数组中第一个大于x的位置，即为答案
            res[id] = upper_bound(dp.begin(), dp.end(), x) - dp.begin();
    }

    for (int i = 0; i < q; i++)
        cout << res[i] << endl;
}

int main() {
    cin.tie(0);
    ios_base::sync_with_stdio(false);
    solve();
    return 0;
}
```

