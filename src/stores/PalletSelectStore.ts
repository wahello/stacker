import { observable, action } from 'mobx'

export default class PalletSelectStore {
	@observable input: string
	@observable inputError: string

	@observable side: string
	@observable column: string
	@observable row: string

	columnNames: string[]
	rowNames: string[]

	constructor() {
		this.columnNames = []
		this.rowNames = []

		for(let i: number = 1; i <= 71; i++) {
			if(i < 10)
				this.columnNames.push('0' + i.toString())
			else
				this.columnNames.push(i.toString())
		}
		
		for(let i: number = 0; i < 8; i++) {
			this.rowNames.push(String.fromCharCode(65 + i))
		}

		this.input = ''
		this.inputError = ''

		this.side = ''
		this.column = ''
		this.row = ''
	}

	@action setInput(input: string): void {
		this.inputError = ''

		if(input.length === 0) {
			this.input = ''
			this.side = ''
			this.column = ''
			this.row = ''

			return
		}

		if(input.length >= 1) {
			const side: string = input.charAt(0)

			if(side === 'L') {
				this.side = 'left'
			} else if(side === 'R') {
				this.side = 'right'
			} else if(side === 'l') {
				input = 'L' + input.substr(1)
				this.side = 'left'
			} else if(side === 'r') {
				input = 'R' + input.substr(1)
				this.side = 'right'
			} else {
				this.inputError = 'Strana je identifikována písmenem L (vlevo) nebo R (vpravo)'
				return
			}
		}
		
		let columnFirst: string, columnSecond: string
		if(input.length >= 2) {
			columnFirst = input.charAt(1)

			if(
				isNaN(parseInt(columnFirst))
				|| parseInt(columnFirst) > 7
			) {
				this.inputError = 'První znak pro sloupec musí být číslice mezi 0 a 7'
				return
			}

			if(input.length >= 3) {
				columnSecond = input.charAt(2)
	
				if(
					isNaN(parseInt(columnSecond))
					|| parseInt(columnFirst + columnSecond) <= 0
					|| parseInt(columnFirst + columnSecond) > 71
				) {
					this.inputError = 'Druhý znak pro sloupec musí být číslice, celkové číslo nesmí přesáhnout 71'
					return
				}

				this.column = input.substr(1, 2)
			} else {
				this.column = ''
			}
		} else {
			this.column = ''
		}

		if(input.length >= 4) {
			let row: string = input.charAt(3)
			let rowNumber: number = row.charCodeAt(0) - 65

			if(rowNumber >= 32 && rowNumber <= 39)
				rowNumber -= 32

			if(rowNumber < 0 || rowNumber > 7) {
				this.inputError = 'Řádek je označen písmeny v rozmezí mezi A a H'
				return
			}

			const rowChar: string = String.fromCharCode(65 + rowNumber)
			input = input.substr(0, 3) + rowChar
			this.row = rowChar
		} else {
			this.row = ''
		}

		if(input.length > 4)
			return

		this.input = input
	}

	@action setSide(side: string): void {
		this.inputError = ''
		this.side = side

		const sideLetter: string = side === 'left' ? 'L' : 'R'
		this.input = sideLetter + this.column + this.row
	}

	@action setColumn(column: string): void {
		this.inputError = ''
		this.column = column

		this.input = this.input.substr(0, 1) + column + this.row
	}

	@action setRow(row: string): void {
		this.inputError = ''
		this.row = row

		this.input = this.input.substr(0, 3) + row
	}
}