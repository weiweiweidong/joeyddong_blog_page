---
title: 'AtCoder Beginner Contest 386 Summary'
slug: 'AtCoder_386_Summary'
date: '2025-01-02 09:09:33'
article_lang: 'zh'
summary: '本文是 AtCoder Beginner Conteset（ABC）386 的总结笔记。'
categories:
  - '编程'
tags:
  - 'Algorithm'
  - 'Programming Contest'
  - 'AtCoder'
  - 'ABC'
cover: 'https://my-markdown-picture-bedding.oss-ap-northeast-1.aliyuncs.com/uPic/2024-12-11/Cover_AtCoder.jpeg'
---

本文是 AtCoder Beginner Conteset（ABC）386 的总结笔记。

<!-- more -->
# **A - Full House 2**

Problem：[A - Full House 2](https://atcoder.jp/contests/abc386/tasks/abc386_a)

模拟

有 ABCD 写着数字的四张牌。问能否添加一张牌，使得五张牌构成：3 张 x 和 2 张 y 的形式。
$1 \le A,B,C,D \le 13$
思路非常简单。

```c++
// Problem: https://atcoder.jp/contests/abc386/tasks/abc386_a

#include <bits/stdc++.h>
using namespace std;
typedef long long LL;
typedef pair<int, int> PII;

int a[4];
map<int, int> h;

void solve() {
    // 读入四个数，同时计数
    for (int i = 0; i < 4; i++) {
        cin >> a[i];
        h[a[i]]++;
    }

    // 排序一下
    sort(a, a + 4);

    // 我们只看第一个数和最后一个数即可
    // 只能是 22 或者 13 或者 31 的形式，才能构成题目需要的形式
    if ((h[a[0]] == 2 && h[a[3]] == 2) || (h[a[0]] == 3 && h[a[3]] == 1) ||
        (h[a[0]] == 1 && h[a[3]] == 3))
        cout << "Yes" << endl;
    else
        cout << "No" << endl;
}

int main() {
    cin.tie(0);
    ios_base::sync_with_stdio(false);
    solve();
    return 0;
}
```

# **B - Calculator**

Problem：[B - Calculator](https://atcoder.jp/contests/abc386/tasks/abc386_b)

模拟

这道题目其实很暴力。只需要将所有的 `00` 转换成一个不相关的字符，最后看一下总长度就知道需要按多少次按键了。

本答案是将所有的 `00` 都转化为 `1`。

```c++
// Problem: https://atcoder.jp/contests/abc386/tasks/abc386_b

#include <bits/stdc++.h>
using namespace std;
typedef long long LL;
typedef pair<int, int> PII;

string s;

void solve() {
    cin >> s;

    // 把所有的 00 转化为 1
    while (s.find("00") != s.npos)
        s.replace(s.find("00"), 2, "1");

    // 输出答案
    cout << s.size() << endl;
}

int main() {
    cin.tie(0);
    ios_base::sync_with_stdio(false);
    solve();
    return 0;
}
```

# **C - Operate 1**

Problem：[C - Operate 1](https://atcoder.jp/contests/abc386/tasks/abc386_c)

模拟

## 题目：

有三种操作：

- 给 S 中添加任意一个字符
- 删除 S 中的任意一个字符
- 选择 S 中的任意一个字符并转化为另一个字符

请判断执行 $[0,K]$ 次操作中，是否能将 S 转化为 T

## 约束条件：

字符串最大长度 $500000$

$\color{red}{K=1}$

## 思路：

本题目是 F 题在 K=1 情况下的特例。

分成三种情况来讨论：

- case1：S 与 T 长度相同

- case2：S 比 T 长度短 1

- case3：S 比 T 长度长 1

case1 处理方法：

​	找到正向和反向的最后一个差异点，如果位置相同，说明只有一个差异点

case2 和 case3 处理方法：

​	只看长的那个字符串。找到第一个差异点，判断一下去掉这个差异点的字符串s 和 t 是否相同即可。

```c++
// Problem: https://atcoder.jp/contests/abc386/tasks/abc386_c

#include <bits/stdc++.h>
using namespace std;
typedef long long LL;
typedef pair<int, int> PII;

string s, t;
int k;

void solve() {
    // 读入数据
    cin >> k >> s >> t;

    // 如果 s 和 t 完全相同
    if (s == t) {
        cout << "Yes" << endl;
        return;
    }

    // 情况 1：如果长度相同
    if (s.size() == t.size()) {
        int x, y;
        // 从前到后，找到最后一个差异点位置
        for (int i = 0; i < s.size(); i++)
            if (s[i] != t[i])
                x = i;
        // 从后往前，找到第一个差异点位置
        for (int i = s.size() - 1; i >= 0; i--)
            if (s[i] != t[i])
                y = i;
        // 如果位置相同，说明只有一个点不同
        if (x == y)
            cout << "Yes" << endl;
        else
            cout << "No" << endl;
        return;
    }

    // 如果长度不同，让 s 是长的那个
    if (s.size() < t.size())
        swap(s, t);

    // 如果长度差异为 1
    if (s.size() - t.size() == 1) {
        int x;
        // 找到第一个差异点
        for (int i = 0; i < s.size(); i++)
            if (s[i] != t[i]) {
                x = i;
                break;
            }

        // 跳过这一个差异点，把前面和后面拼接起来
        string tmp = s.substr(0, x) + s.substr(x + 1);

        // 如果拼接后的字符串 tmp 和 t 相同，说明只有一个差异点
        if (tmp == t)
            cout << "Yes" << endl;
        else
            cout << "No" << endl;
        return;
    }

    // 如果能走到这一步，说明长度差异大于 2
    cout << "No" << endl;
}

int main() {
    cin.tie(0);
    ios_base::sync_with_stdio(false);
    solve();
    return 0;
}
```

# **D - Diagonal Separation**

Problem：[D - Diagonal Separation](https://atcoder.jp/contests/abc386/tasks/abc386_d)

贪心

## 题目：

给定一个 $N\times N$ 的网格，希望能按照下面条件将格子涂成黑色或白色：

- 对于每一行：$i$ 左边的格子都是黑色，右边的格子都是白色
- 对于每一列：$i$ 上面的格子都是黑色，下面的格子都是白色

已经给定了 $M$ 个格子的颜色，请问是否可以将剩余的 $N^2-M$ 个格子涂色，以满足上面条件。

## 约束条件：

$1\leq N\leq 10^9$

$1\leq M\leq \min(N^2,2\times 10^5)$

## 思路：

如果所有的点都是合法的，我们可以很容易的发现单调性：

​	从上往下，最左侧的白色格子出现的位置 `min_y` 一定是逐渐减小的。

一旦要是有任何一个黑色格子的 y 坐标大于 `min_y` ，就一定不能满足题目的约束条件。

```c++
// Problem: https://atcoder.jp/contests/abc386/tasks/abc386_d

#include <bits/stdc++.h>
using namespace std;
typedef long long LL;
typedef pair<int, int> PII;

const int N = 2e5 + 10;

int n, m;
struct Node {
    int x, y;
    char c;
} p[N];

bool cmp(const Node& a, const Node& b) {
    if (a.x == b.x)
        return a.y < b.y;
    return a.x < b.x;
}

void solve() {
    // 读入数据
    cin >> n >> m;
    for (int i = 0; i < m; i++)
        cin >> p[i].x >> p[i].y >> p[i].c;

    // 让格子升序排列
    sort(p, p + m, cmp);

    // min_y 初始化
    int min_y = 1e9 + 10;
    // 遍历所有的格子
    for (int i = 0; i < m; i++) {
        // 如果是白色：维护min_y，即白色出现在最左侧的位置
        if (p[i].c == 'W')
            min_y = min(min_y, p[i].y);
        // 如果是黑色格子，并且 y 值超过了 min_y，说明条件不成立
        else if (p[i].y >= min_y) {
            cout << "No" << endl;
            return;
        }
    }
    cout << "Yes" << endl;
}

int main() {
    cin.tie(0);
    ios_base::sync_with_stdio(false);
    solve();
    return 0;
}
```

# **E - Maximize XOR**

Problem：[E - Maximize XOR](https://atcoder.jp/contests/abc386/tasks/abc386_e)

DFS + 优化

## 题目：

给定一个长度为 $N$ 的非负整数序列 $A$，整数 $K$。

保证组合数 $C^K_N \leq 10^6$ 

从 $A$ 中选择 $K$ 个不同的元素，求他们 $XOR$ 值的最大值。

备注：

$XOR$：相异为 $1$，相同为 $0$。例如：$011 \oplus 101 = 110$

## 约束条件：

$1\leq K\leq N\leq 2\times 10^5$

$0\leq A_i<2^{60}$

$\dbinom{N}{K}\leq 10^6$
## 思路：

这道题目直接使用 DFS 搜索。但是需要两处前置知识：

### 前置知识 1：XOR 的性质

XOR 有一些重要的性质：

1. **可逆性**：如果 $c = a \oplus b$，那么 $c \oplus b= a$，也就是说再次 XOR 同一个数就相当于把它 “消去”
2. **自我抵消**：任何数字和他本身做 XOR，结果都是0，即 $a \oplus a = 0$
3. **恒等性**：热河数字 a 和 0 做 XOR，结果不变，即 $a \oplus 0 = a$

从上面的性质，可以推出本题中用到的结论：

假设长度为 N 的数列 $(A_1, A_2,...,A_N)$，取出了前 K 个元素做 XOR 运算。

等价于先把所有元素做 XOR 运算，再和没有取出的 N-K 个元素做 XOR 运算。

$A_1 \oplus A_2 \oplus ... \oplus A_K = (A_1 \oplus A_2 \oplus ... \oplus A_N) \oplus A_{K+1} \oplus ... \oplus A_{N}$

### 前置知识 2：组合数的性质

组合数有一个重要的性质：$ C_n^m = C_n^{n-m}$

显然，从 n 个物品里面选 m 个组成的方案数，和从 n 个物品中选 n-m 个丢掉的方案数是一致的。

### 本题思路：

根据上述的两条性质，我们可以对 DFS 进行优化：

- 如果k的值比较小，我们就搜 $C^k_n$ 即可
- 如果 k 的值比较大，我们就搜 $C^{n-k}_n$，但是前提要先将所有数组 a 的值进行一遍 XOR 运算。

为什么要使用这个优化方法呢？

本题中的递归函数 dfs，每调用一次我可以视为 $O(1)$ 的时间复杂度。当 k 很大的时候，递归函数总的调用次数为 $\sum^K_{i=0} C^i_N$ 次，尽管 $C^K_N$ 的值可能并不大，但是 $C^{N/2}_N$ 的值会非常的大。

举例：尽管 $C^{98}_{100} = 4950 < 10^6$ ，但是中间值 $C^{50}_{100} = 10^{29}$ 非常的巨大，显然超出了限定的时间复杂度。

所以使用这个优化方法可以极大的减少时间复杂度。

```c++
// Problem: https://atcoder.jp/contests/abc386/tasks/abc386_e

#include <bits/stdc++.h>
using namespace std;
typedef long long LL;
typedef pair<int, int> PII;

const int N = 2e5 + 10;

LL res;
LL a[N];
int n, k;

void dfs(int x, LL sum, int n, int k) {
    // 搜到底了
    if (k == 0) {
        res = max(res, sum);
        return;
    }
    // 超出范围了
    if (x == n + 1)
        return;

    // 选中当前值
    dfs(x + 1, sum ^ a[x], n, k - 1);
    // 不选当前值
    dfs(x + 1, sum, n, k);
}

void solve() {
    cin >> n >> k;
    for (int i = 1; i <= n; i++)
        cin >> a[i];

    LL sum = 0;
    // 如果 k 比较大，C(k,n)比较难算，我们就算C(n-k,n)
    if (k > n / 2) {
        k = n - k;
        for (int i = 1; i <= n; i++)
            sum ^= a[i];
    }

    // dfs
    dfs(1, sum, n, k);

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

# **F - Operate K**

Problem：[F - Operate K](https://atcoder.jp/contests/abc386/tasks/abc386_f)

最短编辑距离 + 带状 DP

## 题目：

有三种操作：

- 给 S 中添加任意一个字符
- 删除 S 中的任意一个字符
- 选择 S 中的任意一个字符并转化为另一个字符

请判断执行 $[0,K]$ 次操作中，是否能将 S 转化为 T

## 约束条件：

字符串最大长度 $5\times 10^5$

$\color{red}{1 \le K \le 20}$

## 思路：

本题是 C 的加强版。

直观上，这是一道“最短编辑距离”问题。

### 前置知识：“最短编辑距离”问题的标准做法：

这类问题有一个标准的 DP 做法如下：

令 $f[i][j]$ 表示字符串 $S$ 的前 $i$ 个字符变成 $T$ 的前 $j$ 字符所需要的最短编辑距离。

初始状态 $f[0][0]=0$，那么 i 和 j 的双重循环下，状态迁移公式为：

$$f[i][j] = min(f[i-1][j]+1 , f[i][j-1]+1 , f[i-1][j-1]+c)$$

其中：

- $f[i-1][j]+1$ ：表示删除 S 的一个字符
- $f[i][j-1]+1$ ：表示给 S 插入一个字符（或者说给 T 删去一个字符）
- $f[i-1][j-1] + c$：表示“替换”或“匹配”。如果 $S_i=T_j$，则无需替换，$c=0$；否则 $c=1$

总时间复杂度为：$O(|S| \times |T|)$

### 本题的优化思路：带状区域计算 DP

如果按照标准做法，那本题的时间复杂度是 $O(5\times 10^5 \times 5 \times 10^5)$，显然会 TLE。

但是本题规定了最大操作数不超过 $K$（不超过 20 次操作），这个约束条件就带来了优化空间。

即：只对“有希望编辑距离不超过 $K$” 的位置进行 DP 计算。其他位置将会直接认为距离非常大（用 ∞ 表示），从而剪枝掉大量不必要的计算。

如何做？

在计算 $f[i][j]$ 的时候，如果 $|i-j|$ 的差距很大，意味着 $S$ 比 $T$ 短或长很多。如果要将 $S$ 变得和 $T$ 完全相同，则操作次数至少要大于 $K$。此时就可以将 $|i-j|$ 超过 $K$ 的区域直接视为 +∞，不再计算。

具体做法：

- 只让 $j$ 在 $[i-K, i+K]$ 的范围内活动
- 超出范围的 $f[i][j]$ 直接置为 +∞

这样就将原本 $O(|S|\times |T|)$ 的时间复杂度压缩到 $O((|S|+|T|)\times K)$ 

### 注意点：

习惯上可能直接就把 f 数组声明为 $f[N][N]$ 大小。但是本题中 $N$ 最大为 `5e5`，此时开出的数组空间为：`5e5 * 5e5 * sizeof(int)` 大小的内存。对于 `int` 类型（假设为 4 字节大小），这个数组将会消耗 `1e12 byte = 1000GB` 的空间，显然是不现实的。如果直接声明这么大的数组，会报 `bus error` 错误。

而且我们实际上只使用了中间很小的一部分，绝大多数的空间都是用不上的。所以使用偏置换算的方法即可。

```c++
// Problem: https://atcoder.jp/contests/abc386/tasks/abc386_f

#include <bits/stdc++.h>
using namespace std;
typedef long long LL;
typedef pair<int, int> PII;

const int N = 5e5 + 10;

string S, T;
int K;
int f[N][60];

int get_dp(int i, int j) {
    if (abs(i - j) > K)
        return 0x3f3f3f3f;
    // 偏置
    return f[i][j - i + 30];
}

void solve() {
    cin >> K >> S >> T;
    int slen = S.size(), tlen = T.size();

    S = " " + S;
    T = " " + T;

    // f 数组初始化为正无穷
    memset(f, 0x3f, sizeof f);

    /* 设置初始边界 */
    // 对应原来的 f[0][0]：即将空串转化为空串需要 0 步操作
    f[0][30] = 0;
    // 将空串变成长度为 i 的串，需要 i 步插入操作
    for (int i = 1; i <= K; i++)
        f[0][30 + i] = i;
    // 将长度为 i 的串变成空串，需要 i 步删除操作
    for (int i = 1; i <= K; i++)
        f[i][30 - i] = i;

    /* DP */
    // 遍历 S 的每一位
    for (int i = 1; i <= slen; i++) {
        // 遍历偏置
        for (int x = 0; x < 60; x++) {
            // 还原出真正的 j
            /*
                原理：j 只能在[i-30,i+30]范围内，所以下界 j>=i-30
                这里加入了偏置 x 去掉了等号
                即 j = i - 30 + x
            */
            int j = i - 30 + x;
            // 如果 j 超出了范围
            if (j <= 0 || j > tlen)
                continue;

            int cur_dp = 0x3f3f3f3f;
            // S 删除一个字符
            cur_dp = min(cur_dp, get_dp(i - 1, j) + 1);
            // S 添加一个字符（即，T 删除一个字符）
            cur_dp = min(cur_dp, get_dp(i, j - 1) + 1);

            int c = 1;
            if (S[i] == T[j])
                c = 0;
            // S 替换一个字符 或者 不操作
            cur_dp = min(cur_dp, get_dp(i - 1, j - 1) + c);
            // 更新 f
            f[i][x] = cur_dp;
        }
    }

    // 输出结果
    if (get_dp(slen, tlen) <= K)
        cout << "Yes" << endl;
    else
        cout << "No" << endl;
}

int main() {
    cin.tie(0);
    ios_base::sync_with_stdio(false);
    solve();
    return 0;
}
```

