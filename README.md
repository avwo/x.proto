# x.proto
解析 Protobuf 数据工具库，支持 Node、浏览器、小程序。

# 用法
1. 安装
    ``` sh
    tnpm i --save-dev x.proto
    ```
2. 配置 Webpack loader
    ``` js
    module.exports = {
      module: {
        rules: [
          {
            test: /\.proto$/,
            use: {
              loader: 'x.proto/loader',
            },
          },
        ],
      },
    };
    ```
3. 代码
    ``` js
    import Proto from 'x.proto';
    import protos from '../protos/test.proto';

    const codec = new Proto(protos);

    // 用法1
    codec.decode(package.cmd, data/*, {
      binaryAsBase64?: boolean;
      longsAsStrings?: boolean;
      bufferAsStrings?: boolean;
      length?: number;
      encoding?: string;
    }*/);

    // 用法2
    const cmdCodec = codec.lookup(package.cmd);
    cmdCodec.decode(data/*, {
      binaryAsBase64?: boolean;
      longsAsStrings?: boolean;
      bufferAsStrings?: boolean;
      length?: number;
      encoding?: string;
    }*/);

    // buffer 转 string
    codec.decodeBuffer(ArrayBuffer | object, clone?: true by default);
    ```
