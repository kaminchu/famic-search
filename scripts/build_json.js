import iconv from "iconv-lite";
import fs from "fs";
import csv from "csv";
import glob from "glob";
import {flatten} from "lodash";

getDetailInfo().then(console.log);

// 農薬基本情報
async function getBasicInfo(){
  return new Promise((resolve) => {
    glob("work/csvs/*0.csv", async (err, files) => {
      if(err){
        throw err;
      }

      const arrayOfFiles = Promise.all(files.map(async (file) => {
        const columns = {
          "登録番号": "registrationNumber",
          "農薬の種類": "type",
          "農薬の名称": "name",
          "正式名称": "formalName",
          "有効成分": "activeIngredient",
          "総使用回数における有効成分": "activeIngredientInTotalUseNumber",
          "濃度": "concentration",
          "混合数": "mixedNumber",
          "用途": "use",
          "剤型名": "dosageTypeName",
          "登録年月日": "registrationAt",
          "登録の有効期限": "expiration",
        };
        return await csvToArray(file, columns);
      }));
      resolve(await arrayOfFiles);
    });
  });
}

// 適用情報
async function getDetailInfo(){
  return new Promise((resolve) => {
    glob("work/csvs/!(*0).csv", async (err, files) => {
      if(err){
        throw err;
      }

      const arrayOfFiles = Promise.all(files.map(async (file) => {
        const columns = {
          "登録番号": "registrationNumber",
          "用途": "use",
          "農薬の種類": "typesOfPesticides",
          "農薬の名称": "nameOfPesticide",
          "略称": "shortName",
          "作物名": "cropName",
          "適用場所": "applicationLocation",
          "適用病害虫雑草名": "applicablePestWeedName",
          "使用目的": "intendedUse",
          "希釈倍数使用量": "dilutionMultipleUsage",
          "散布液量": "sprayVolume",
          "使用時期": "whenToUse",
          "本剤の使用回数": "numberOfTimesOfUseOfThisDrug",
          "使用方法": "howToUse",
          "くん蒸時間": "fumigationTime",
          "くん蒸温度": "fumigationTemperature",
          "適用土壌": "applicableSoil",
          "適用地帯名": "applicableZoneName",
          "適用農薬名": "applicablePesticideName",
          "混合数": "mixedNumber",
          "有効成分①を含む農薬の総使用回数": "totalNumberOfPesticideUseIncludingActiveIngredient1",
          "有効成分②を含む農薬の総使用回数": "totalNumberOfPesticideUseIncludingActiveIngredient2",
          "有効成分③を含む農薬の総使用回数": "totalNumberOfPesticideUseIncludingActiveIngredient3",
          "有効成分④を含む農薬の総使用回数": "totalNumberOfPesticideUseIncludingActiveIngredient4",
          "有効成分⑤を含む農薬の総使用回数": "totalNumberOfPesticideUseIncludingActiveIngredient5"
        };
        return await csvToArray(file, columns);
      }));
      resolve(await arrayOfFiles);
    });
  });
}



// 共通ツール
/**
 * csvを配列にしてくれる
 * @param file
 * @param columns
 * @returns {Promise<any>}
 */
function csvToArray(file, columns){
  const parser = csv.parse({
    columns : line => line.map(key => columns[key])
  });

  fs.createReadStream(file)
    .pipe(iconv.decodeStream("SJIS"))
    .pipe(iconv.encodeStream("UTF-8"))
    .pipe(parser);


  return new Promise(resolve => {
    parser.on("readable", () => {
      const array = [];
      let row;
      while (row = parser.read()) {
        array.push(row);
      }
      resolve(array);
    });
  });
}

function flat(){

}
