---
title: 'C++ string 的常用用法'
slug: 'CPP_string_的常用用法'
date: '2024-12-19 22:41:55'
article_lang: 'zh'
summary: '本文是 C++ 中 string 的常用用法的总结笔记。'
categories:
  - '编程'
tags:
  - 'C++'
  - 'STL'
cover: 'https://my-markdown-picture-bedding.oss-ap-northeast-1.aliyuncs.com/uPic/2024-12-19/Cover_CPP.jpeg'
---

本文是 C++ 中 `string` 的常用用法的总结笔记。

<!-- more -->

头文件 `#include<string>`

# 1. 初始化 / 赋值

```cpp
string a = "hello world";
string s = string(10, 't');  // 用10个字符't'初始化
string c(10, 't');
string d(a.begin(), a.end() - 3);  // a的一部分赋值给d
string e(a.rbegin(), a.rend()); // a的倒序赋值给e
```

# 2. 长度与判空

`a.size()` 或者 `a.length()` 均可获得字符串长度

`a.empty()` 判断是否为空

`a.clear()` 把字符串清空

# 3. 子串

1. 使用 string 的构造函数来提取子串

   ```cpp
   string b = string(string a, int start, int num);
   ```

   截取字符串 `str` 从 `start` 起 `num` 个字符，赋值给子串 `substr`

2. 使用 substr 函数

   ```cpp
   string b = a.substr(int start, int num);  // 从start开始长度为num的子串提取出来
   string c = a.substr(2);  // 把a串从2位置开始到末尾的子串提取出来
   string d = a.substr(2, 4); // 把a串从2位置开始，长度为4的子串提取出来
   ```

# 4. 查找

```cpp
string a = "abcabxabcc";

cout << a.find('a') << endl;  // 查找字符，输出位置
cout << a.find("abx") << endl;  // 查找字符串，输出找到的起始位置

// 判断没有找到字符串：有两种写法，均可
if (a.find("xx") == a.npos)
    cout << "Not Find" << endl;
if (a.find("xx") == string::npos)
    cout << "Not Find" << endl;
```

# 5. 替换，插入与删除

```cpp
string a = "abcdefg";

/* 替换 */
a.replace(2, 3, "tttt");  // 从2位置开始，长度为3的部分，替换为tttt。
	// 最后输出结果为 abttttfg

/* 插入 */
a.insert(2, "tttt");  // 从2位置开始，插入tttt
	// 最后输出结果为 abttttcdefg
a.insert(0, "tttt");	//在开头插入
a.insert(a.size(), "tttt"); // 在末尾插入

/* 删除 */
a.erase(2,3);		// 删除 从第0位开始，长度为3的字符串。结果为 abfg
a.erase(0,2);  // 删除前两个元素。结果为 cdefg
a.erase(3);    // 删除位置3以后的所有字符。结果为 abc
```

# 6. 遍历

三种常用的遍历方式：

```cpp
string a = "abcdefg";

// 方法 1：
for (int i = 0; i < a.size(); i++)
    cout << a[i] << endl;

// 方法 2：
for (char c : a)
    cout << c << endl;

// 方法 3：迭代器
for (string::iterator it = a.begin(); it != a.end(); ++it)
    cout << *it << endl;
```

# 7. 数值与字符串相互转换

```cpp
int b = stoi("121");      // 字符串转为int
float c = stof("12.345");  // 字符串转为float

string d = to_string(121);     // int转为字符串
string e = to_string(12.345);  // float转为字符串
```

# 8. 排序

```cpp
string a = "Aa32Cc1bB";

// 升序排列：数字1-9 -> 大写字母A-Z -> 小写字母a-z （实际就是按照 ACSII 码从小到大排序）
sort(a.begin(), a.end());
cout << a << endl;    // 结果为：123ABCabc

// 降序排列：小写字母z-a -> 大写字母Z-A -> 数字9-1
sort(a.begin(), a.end(), greater<char>());
cout << a << endl;    // 结果为：cbaCBA321
```

# 9. 杂项

```cpp
string a = "test";

// 末尾插入一个字符（注意，这里只能是字符）
a.push_back('2');

// 弹出最后一个字符
a.pop_back();
```
