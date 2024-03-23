---
layout: single
title:  "C# CellAutomata Algorithm"
permalink: /CSharp/CellAutomata
categories: C#
typora-root-url: ../
tag: [C#, CSharp, Algorithm, CellAutomata, CellAutomataAlgorithm, Random]
toc: true
toc_sticky : true
author_profile: false
sidebar:
    nav: docs
---


# Unity C# CellAutomata Algorithm

```c#
using System;
using System.Collections;
using System.Collections.Generic;
using System.Xml;
using UnityEngine;
using UnityEngine.Tilemaps;

#region Cellular Automata
public class MapHandler
{
    System.Random rand = new System.Random();

public int[,] Map;

public int MapWidth { get; set; }
public int MapHeight { get; set; }
public int PercentAreWalls { get; set; }

public MapHandler()
{
    MapWidth = 50;
    MapHeight = 50;
    PercentAreWalls = 40;

​    RandomFillMap();
}

public void MakeCaverns()
{
    for (int column = 0, row = 0; row <= MapHeight - 1; row++)
    {
        for (column = 0; column <= MapWidth - 1; column++)
        {
            Map[column, row] = PlaceWallLogic(column, row);
        }
    }
}

public int PlaceWallLogic(int x, int y)
{
    int numWalls = GetAdjacentWalls(x, y, 1, 1);

​    if (Map[x, y] == 1)
​    {
​        if (numWalls >= 4)
​        {
​            return 1;
​        }
​        if (numWalls < 2)
​        {
​            return 0;
​        }

​    }
​    else
​    {
​        if (numWalls >= 5)
​        {
​            return 1;
​        }
​    }
​    return 0;
}

public int GetAdjacentWalls(int x, int y, int scopeX, int scopeY)
{
    int startX = x - scopeX;
    int startY = y - scopeY;
    int endX = x + scopeX;
    int endY = y + scopeY;

​    int iX = startX;
​    int iY = startY;

​    int wallCounter = 0;

​    for (iY = startY; iY <= endY; iY++)
​    {
​        for (iX = startX; iX <= endX; iX++)
​        {
​            if (!(iX == x && iY == y))
​            {
​                if (IsWall(iX, iY))
​                {
​                    wallCounter += 1;
​                }
​            }
​        }
​    }
​    return wallCounter;
}

bool IsWall(int x, int y)
{
    if (IsOutOfBounds(x, y))
    {
        return true;
    }

​    if (Map[x, y] == 1)
​    {
​        return true;
​    }

​    if (Map[x, y] == 0)
​    {
​        return false;
​    }
​    return false;
}

bool IsOutOfBounds(int x, int y)
{
    if (x < 0 || y < 0)
    {
        return true;
    }
    else if (x > MapWidth - 1 || y > MapHeight - 1)
    {
        return true;
    }
    return false;
}

public int[,] MapToString()
{
    int[,] returnInt = new int[100, 100];

​    List<int> mapSymbols = new List<int>();
​    mapSymbols.Add(0);
​    mapSymbols.Add(1);
​    //mapSymbols.Add(2);

​    for (int column = 0, row = 0; row < MapHeight; row++)
​    {
​        for (column = 0; column < MapWidth; column++)
​        {
​            returnInt[column, row] += mapSymbols[Map[column, row]];
​        }
​    }
​    return returnInt;
}

public void BlankMap()
{
    for (int column = 0, row = 0; row < MapHeight; row++)
    {
        for (column = 0; column < MapWidth; column++)
        {
            Map[column, row] = 0;
        }
    }
}

public void RandomFillMap()
{
    Map = new int[MapWidth, MapHeight];

​    int mapMiddle = 0;
​    for (int column = 0, row = 0; row < MapHeight; row++)
​    {
​        for (column = 0; column < MapWidth; column++)
​        {
​            if (column == 0)
​            {
​                Map[column, row] = 1;
​            }
​            else if (row == 0)
​            {
​                Map[column, row] = 1;
​            }
​            else if (column == MapWidth - 1)
​            {
​                Map[column, row] = 1;
​            }
​            else if (row == MapHeight - 1)
​            {
​                Map[column, row] = 1;
​            }
​            else
​            {
​                mapMiddle = (MapHeight / 2);

​                if (row == mapMiddle)
​                {
​                    Map[column, row] = 0;
​                }
​                else
​                {
​                    Map[column, row] = RandomPercent(PercentAreWalls);
​                }
​            }
​        }
​    }
}

int RandomPercent(int percent)
{
    if (percent >= rand.Next(1, 101))
    {
        return 1;
    }
    return 0;
}

public MapHandler(int mapWidth, int mapHeight, int[,] map, int percentWalls = 40)
{
    this.MapWidth = mapWidth;
    this.MapHeight = mapHeight;
    this.PercentAreWalls = percentWalls;
    this.Map = new int[this.MapWidth, this.MapHeight];
    this.Map = map;
}

}
#endregion

public class MapCreate : MonoBehaviour
{
    #region MAP VAR
    MapHandler[] Map = new MapHandler[5];
    Vector3[,] mVMap = new Vector3[50, 50];
    int[,] mNum = new int[50, 50];
    public GameObject mStage;
    private GameObject[] StageObj = new GameObject[5];
    public GameObject[] Tile = new GameObject[4];
    public int mMapNum = 0;
    #endregion

#region OBJ VAR
public GameObject Respon;
private Vector3 vRespon;

public GameObject Stairs;
private Vector3 vStairs;

public GameObject ResEnemy;
private Vector3 vResEnemy;
#endregion

#region MAP method
public void MapSet()
{
    Map[0] = new MapHandler();
    Map[0].PercentAreWalls = UnityEngine.Random.Range(40, 48);
    Map[0].RandomFillMap();
    Map[0].MakeCaverns();

​    for (int x = 0; x < 50; x++)
​        for (int y = 0; y < 50; y++)
​            mVMap[x, y] = new Vector3(x, y, 0);

​    mNum = Map[0].MapToString();

​    StageObj[0] = Instantiate(mStage.gameObject, new Vector3(0.0f, 0.0f, 0.0f), Quaternion.identity);

​    for (int x = 0; x < 50; x++)
​        for (int y = 0; y < 50; y++)
​            Instantiate(Tile[mNum[x, y]].gameObject, mVMap[x, y], Quaternion.identity).transform.parent = StageObj[0].transform;

​    MapGCR2x2(ref vStairs, mNum, 2, -1, 4);
​    Instantiate(Stairs, vStairs, Quaternion.identity).transform.parent = StageObj[0].transform;

}

public void MapDelete(ref int StageSet)
{
    Destroy(StageObj[StageSet]);
    StageObj[StageSet + 1].SetActive(true);
    StageSet++;
}

public void MapGCR2x2(ref Vector3 vM, int[,] T, int S = 2, float Y = -1.0f, int nNS = 0, int nNumSet = 0)
{
    mNum = Map[nNumSet].MapToString();
    System.Random mX = new System.Random(),
                  mY = new System.Random();
    bool Set = true;
    int h = 0;
    while (Set)
    {
        h++;
        int w = 0;
        int tMX = mX.Next(0 + (S / 2), 50 - (S / 2));
        int tMY = mY.Next(0 + (S / 2), 50 - (S / 2));

​        for (int x = -(S / 2); x < (S / 2); x++)
​            for (int y = -(S / 2); y < (S / 2); y++)
​                w = T[tMX + x, tMY + y] == 0 ? w + 1 : -(S * S);

​        vM = new Vector3(tMX, tMY, Y);
​        if (h > 7)
​            S = 2;
​        T[tMX, tMY] = nNS;
​        Set = w < 1;
​    }

}
#endregion

#region IEnumerator
IEnumerator RandTime()
{
    yield return new WaitForSeconds(0.5f);
    MapGCR2x2(ref vRespon, mNum, 6, -9, 5);
    Respon.SetActive(true);
    Respon.transform.position = vRespon;
    Respon.GetComponent<Character>().enabled = true;
}
IEnumerator LoadMap()
{
    yield return new WaitForSeconds(0.5f);
    for (int x = 1; x < 5; x++)
    {
        Map[x] = new MapHandler();
        Map[x].PercentAreWalls = UnityEngine.Random.Range(40, 43 + x);
        Map[x].RandomFillMap();
        Map[x].MakeCaverns();
        yield return new WaitForSeconds(0.5f);

​    }

​    yield return new WaitForSeconds(0.5f);
​    for (int f = 1; f < 5; f++)
​    {
​        mNum = Map[f].MapToString();

​        StageObj[f] = Instantiate(mStage.gameObject, new Vector3(0.0f, 0.0f, -f), Quaternion.identity);

​        for (int x = 0; x < 50; x++)
​            for (int y = 0; y < 50; y++)
​                Instantiate(Tile[mNum[x, y]].gameObject, mVMap[x, y], Quaternion.identity).transform.parent = StageObj[f].transform;

​        MapGCR2x2(ref vStairs, mNum, 2, -f + (-1), 4);
​        Instantiate(Stairs, vStairs, Quaternion.identity).transform.parent = StageObj[f].transform;
​    }

​    for (int f = 1; f < 5; f++)
​        StageObj[f].SetActive(false);

​    StartCoroutine("RandTime");
}
IEnumerator EnemyRespon()
{
​    for (int i = 0; i < 2; i++)
​    {
​        MapGCR2x2(ref vResEnemy, mNum);
​        Instantiate(ResEnemy, vResEnemy, Quaternion.identity);
​        yield return new WaitForSeconds(4.0f);
​    }
}
#endregion

// Start is called before the first frame update
void Start()
{
    StartCoroutine("LoadMap");
    MapSet();
    StartCoroutine("EnemyRespon");
    //Debug.Log(vRespon);

}

}


```

