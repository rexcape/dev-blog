---
title: MyBatis 实现数组存取
date: 2021-09-11 20:59:32
tags:
  - mybatis
categories:
  - 踩坑
---

通过 mybatis 自定义 TypeHandler 实现数组的存取

<!--more-->

## 需求

数据模型是

```java
@Data
@TableName(value = "test", autoResultMap = true)
public class Test {
    private List<Integer> ids;
}
```

传入的参数是

```json
{
  "ids": [1, 2, 3]
}
```

存到数据库里面的要是这样的条目

```plain
+-------+
|  ids  |
+-------+
| 1,2,3 |
+-------+
```

要把这个数据存到数据库中，**存到数据库里面的是 `varchar` 类型**。由于 MySQL 没有数组类型的数据，而且 Mybatis 也没有特定的 TypeHandler 来处理这个类型的数据，所以要写一个自定义的 typeHandler

## 解决方案

新建 `IntegerListTypeHandler` 类，别忘了判空

```java
@MappedJdbcTypes(JdbcType.VARCHAR)
@MappedTypes(List.class)
public class IntegerListTypeHandler extends BaseTypeHandler<List<Integer>> {
    @Override
    public void setNonNullParameter(PreparedStatement preparedStatement, int i, List<Integer> integers, JdbcType jdbcType) throws SQLException {
        if (integers == null) {
            preparedStatement.setString(i, null);
        } else {
            preparedStatement.setString(i, integers.stream().map(String::valueOf).collect(Collectors.joining(",")));
        }
    }

    @Override
    public List<Integer> getNullableResult(ResultSet resultSet, String s) throws SQLException {
        String str = resultSet.getString(s);

        if (str == null) {
            return null;
        } else {
            return Arrays.stream(str.split(",")).map(Integer::parseInt).collect(Collectors.toList());
        }

    }

    @Override
    public List<Integer> getNullableResult(ResultSet resultSet, int i) throws SQLException {
        String str = resultSet.getString(i);

        if (str == null) {
            return null;
        } else {
            return Arrays.stream(str.split(",")).map(Integer::parseInt).collect(Collectors.toList());
        }
    }

    @Override
    public List<Integer> getNullableResult(CallableStatement callableStatement, int i) throws SQLException {
        String str = callableStatement.getString(i);

        if (str == null) {
            return null;
        } else {
            return Arrays.stream(str.split(",")).map(Integer::parseInt).collect(Collectors.toList());
        }
    }
}
```

## 参考

- [mybatisplus 中配置 TypeHanlder 实现自定义转换\_<Sun>的博客-CSDN 博客\_mybatisplus typehandler](https://blog.csdn.net/weixin_41862314/article/details/105553587)

## 相关代码

附上所有相关代码，使用的是 Mybatis-Plus 框架，数据库请自行配置

### controller

`controller/TestController.java`

```java
import lombok.RequiredArgsConstructor;
import me.mazixiang.mybatisplustest.entity.Test;
import me.mazixiang.mybatisplustest.service.TestService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class TestController {
    private final TestService testService;

    @PostMapping("/save")
    public String save(@RequestBody Test t) {
        System.out.println(t.getIds());
        testService.save(t);

        return "success";
    }

    @GetMapping("/get")
    public List<Test> get() {
        return testService.list();
    }
}

```

### entity

`entity/Test.java`

```java
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.util.List;

@Data
@TableName(value = "test", autoResultMap = true)
public class Test {
    @TableField(typeHandler = IntegerListTypeHandler.class)
    private List<Integer> ids;
}
```

`entity/IntegerListTypeHandler.java`

```java
package me.mazixiang.mybatisplustest.entity;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedJdbcTypes;
import org.apache.ibatis.type.MappedTypes;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@MappedJdbcTypes(JdbcType.VARCHAR)
@MappedTypes(List.class)
public class IntegerListTypeHandler extends BaseTypeHandler<List<Integer>> {
    @Override
    public void setNonNullParameter(PreparedStatement preparedStatement, int i, List<Integer> integers, JdbcType jdbcType) throws SQLException {
        if (integers == null) {
            preparedStatement.setString(i, null);
        } else {
            preparedStatement.setString(i, integers.stream().map(String::valueOf).collect(Collectors.joining(",")));
        }
    }

    @Override
    public List<Integer> getNullableResult(ResultSet resultSet, String s) throws SQLException {
        String str = resultSet.getString(s);

        if (str == null) {
            return null;
        } else {
            return Arrays.stream(str.split(",")).map(Integer::parseInt).collect(Collectors.toList());
        }

    }

    @Override
    public List<Integer> getNullableResult(ResultSet resultSet, int i) throws SQLException {
        String str = resultSet.getString(i);

        if (str == null) {
            return null;
        } else {
            return Arrays.stream(str.split(",")).map(Integer::parseInt).collect(Collectors.toList());
        }
    }

    @Override
    public List<Integer> getNullableResult(CallableStatement callableStatement, int i) throws SQLException {
        String str = callableStatement.getString(i);

        if (str == null) {
            return null;
        } else {
            return Arrays.stream(str.split(",")).map(Integer::parseInt).collect(Collectors.toList());
        }
    }
}

```

### mapper

`mapper/TestMapper.java`

```java
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import me.mazixiang.mybatisplustest.entity.Test;

public interface TestMapper extends BaseMapper<Test> {
}

```

### service

`service/TestService.java`

```java
import com.baomidou.mybatisplus.extension.service.IService;
import me.mazixiang.mybatisplustest.entity.Test;

public interface TestService extends IService<Test> {
}
```

`service/impl/TestServiceImpl.java`

```java
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import me.mazixiang.mybatisplustest.entity.Test;
import me.mazixiang.mybatisplustest.mapper.TestMapper;
import me.mazixiang.mybatisplustest.service.TestService;
import org.springframework.stereotype.Service;

@Service
public class TestServiceImpl extends ServiceImpl<TestMapper, Test> implements TestService {
}
```

### SpringApplication

`MybatisPlusTestApplication.java`

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MybatisPlusTestApplication {

    public static void main(String[] args) {
        SpringApplication.run(MybatisPlusTestApplication.class, args);
    }
}
```
