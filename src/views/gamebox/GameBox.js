import React, { useState, useEffect } from 'react'
// import style from './GameBox.module.scss'
import './GameBox.scss'
import MatchesItem from '../../components/gamebox/MatchesItem'

export default function GameBox() {
	let [first, setFirst] = useState('')
	let [stepText, setText] = useState([])
	let [selectList, setSelectList] = useState([])
	let [totalItem, setTotalItem] = useState(0)
	let [currentLine, setCurrentLine] = useState(null)
	let [showErrorText, setShowErrorText] = useState(false)

	useEffect(() => {
		setShowList()
	}, [])

	// 设置选择列表
	const setShowList = () => {
		let obj = [
			{
				matches: Array(3).fill(null),
				keyValue: 'lineone',
				selectAll: false,
				selNumber: 0,
				lineNumber: 1
			},
			{
				matches: Array(5).fill(null),
				keyValue: 'linetwo',
				selectAll: false,
				selNumber: 0,
				lineNumber: 2
			},
			{
				matches: Array(7).fill(null),
				keyValue: 'linethree',
				selectAll: false,
				selNumber: 0,
				lineNumber: 3
			}
		]
		setSelectList(obj)
	}

	const selectFirst = (e) => {
		setFirst(e.target.value)
		let text = `从${e.target.value}先开始拿火柴`
		let newStep = [...[text]]
		setText(newStep)
	}

	// 重新开始游戏
	const restartGame = () => {
		setFirst('')
		setText([])
		setShowList()
		setTotalItem(0)
		setCurrentLine(null)
		setShowErrorText(false)
	}

	// 处理选中事件
	const handleValueChange = (value, index, pIndex) => {
		if (currentLine === null) {
			setCurrentLine(pIndex)
		} else {
			if (pIndex !== currentLine) {
				setShowErrorText(true)
				let backArr = selectList.map((item, num) => {
					if (pIndex === num) {
						item.matches[index] = false
					}
					return item;
				})
				setSelectList(backArr)
				return false;
			} else {
				setShowErrorText(false)
			}
		}
		let newArr = selectList.map((item, num) => {
			if (pIndex === num) {
				item.matches[index] = value
				if (value) {
					item.selNumber++
				} else {
					item.selNumber--
				}
				if (item.selNumber === item.matches.length) {
					item.selectAll = true
				}
			}
			return item;
		})

		setSelectList(newArr)
	}

	// 全选某一行
	const selectLine = (evt, pIndex) => {
		if (currentLine === null) {
			setCurrentLine(pIndex)
		} else {
			if (pIndex !== currentLine) {
				setShowErrorText(true)
				let backArr = selectList.map((item, index) => {
					if (index === pIndex) {
						item.selectAll = false
					}
					return item
				})
				setSelectList(backArr)
				return false;
			} else {
				setShowErrorText(false)
			}
		}
		let val = evt.target.checked
		let newArr = selectList.map((item, index) => {
			if (index === pIndex) {
				item.matches = item.matches.map(child => child = val)
				item.selectAll = val
				if (val) {
					item.selNumber = item.matches.length
				} else {
					item.selNumber = 0
				}
			}
			return item
		})
		setSelectList(newArr)
	}

	// 拿走选中的火柴
	const takeAway = (lineObj, parentIndex) => {
		let newArr = []
		let text = ''
		let count = totalItem
		if (lineObj.selectAll) {
			newArr = [...selectList]
			newArr.splice(parentIndex, 1)
			text = `${first}从第${lineObj.lineNumber}行中拿走了${selectList[parentIndex].matches.length}根火柴`
			count += selectList[parentIndex].matches.length
		} else {
			newArr = selectList.map((item, index) => {
				if (index === parentIndex) {
					item.matches.forEach(item => {
						if (item) {
							count++
						}
					})
					item.matches = item.matches.filter(child => !child)
					text = `${first}从第${item.lineNumber}行中拿走了${item.selNumber}根火柴`
					item.selNumber = 0
				}
				return item
			})
		}
		setSelectList(newArr)
		let textArr = [...stepText, text]
		setText(textArr)
		setTotalItem(count)
		if (count === 15) return
		if (first === 'A') {
			setFirst('B')
		} else {
			setFirst('A')
		}
		setCurrentLine(null)
		setShowErrorText(false)
	}

	return (
		<div className='game-box'>
			<div className='left-desc'>
				<h2>游戏规则</h2>
				<p>15根牙签，分成三行</p>
				<p>两个玩家，每人可以在一轮内，在任意行拿任意根牙签，但不能跨行</p>
				<p>拿最后一根牙签的人即为输家</p>
			</div>
			<div className='game-area'>
				<h2>拿火柴游戏，谁拿掉最后一根谁就输</h2>
				{
					!first &&				
					<div className='the-first'>
						<h3>谁先拿火柴</h3>
						<label htmlFor="radioA">
							<input id="radioA" type="radio" value="A" onChange={selectFirst}/>
						A</label>
						<label htmlFor="radioB">
							<input id="radioB" type="radio" value="B" onChange={selectFirst}/>
						B</label>
					</div>
				}
				{
					showErrorText && <h3 className='error-text'>不可跨行选择</h3>
				}
				{
					first && totalItem < 15 ? <h3 className='next-step'>轮到{first}拿火柴</h3> : ''
				}
				{
					totalItem === 15 && <h3 className='next-step'>游戏结束</h3>
				}
				{
					totalItem === 15 && <h3 className='lost-man'>输家是{first}</h3>
				}

				{/* 游戏内容 */}
				<div className='game-content'>
					<ul>
						{
							selectList.map((item, parentIndex) => <li key={item.keyValue} className="line-item">
								<span className='line-number'>第{ item.lineNumber }行</span>
								{
									item.matches.map((child, index) => <MatchesItem disabled={first ? false : true } value={child} key={index} index={index} pIndex={parentIndex} valueChange={handleValueChange}>
									</MatchesItem>)
								}
								<label className='select-all-btn'>
									<input type='checkbox' onChange={(e) => selectLine(e, parentIndex)} checked={item.selectAll} disabled={first ? false : true}></input>
									全选
								</label>
								<button onClick={() => takeAway(item, parentIndex)} disabled={item.selNumber > 0 ? false : true}>拿走</button>
							</li>)
						}
					</ul>

				</div>

				<button onClick={restartGame}>重新开始</button>
			</div>
			<div className='operate-step'>
				<h2>操作步骤</h2>
				<ul>
					{
						stepText.map(item => <li key={item}>
							{item}
						</li>)
					}
				</ul>
			</div>
		</div>
	)
}
