import test from 'node:test';
import assert from 'node:assert/strict';
import {PAGE,centers,imageRect} from '../src/layout.js';
test('Nine 73 mm circles fit Letter with 7.7 mm margins and 0.5 mm gaps',()=>{
 assert.equal(centers.length,9);
 assert.equal(PAGE.diameter,73);
 for(const c of centers){assert.ok(c.x-PAGE.diameter/2>=7.7);assert.ok(c.x+PAGE.diameter/2<=PAGE.width-7.7);assert.ok(c.y-PAGE.diameter/2>=7.7);assert.ok(c.y+PAGE.diameter/2<=PAGE.height-7.7);}
 for(let i=0;i<9;i++)for(let j=0;j<i;j++)assert.ok(Math.hypot(centers[i].x-centers[j].x,centers[i].y-centers[j].y)>=PAGE.diameter+PAGE.gap-1e-8);
});
test('100% covers circle, reduced zoom leaves white space, pan is proportional',()=>{
 const image={naturalWidth:1600,naturalHeight:800};
 assert.deepEqual(imageRect(image,{zoom:100,x:0,y:0},1000),{x:-500,y:0,w:2000,h:1000});
 assert.deepEqual(imageRect(image,{zoom:25,x:.1,y:-.1},1000),{x:350,y:275,w:500,h:250});
});
