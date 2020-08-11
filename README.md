# WeaverBot
A bot for used for the werewolf: the apocalypse game "Rage Across Israel"

#### Features

* Dynamic and flexible syntax of commands
* In command calculations
* Easy and comfortible UI

#### Basic Usage

To use the bot, add the prefix ```!w``` to your commands.
For example, to echo the message "hello world", write:
```
!w echo hello world!
```
And the bot will write "hello world" in the same discord channel.

#### The Roll Command

The roll command allows th user to roll a set of dice by the current ruleset of Rage Across Israel:

* rolls a number of d10s with a certain difficulty.
* ones cancel out succusses.
* Tens reroll once.
* If no succusses accure, and there is a one: the roll is botched.
* Proficiency cancels out the first one that accures.

###### Basic Roll

To roll 7 dice, for example, simply use the command:
```
!w roll 7
```
The basic difficulty will be 6. You can also perform a calculation in the roll, for example:
```
!w roll 3 + 4
```
Will roll 7 dice, again with difficulty of 6.
There are many operators you can use, such as:
* ```+``` for addition (i.e. ```3 + 1```)
* ```-``` for subtraction (i.e. ```7 - 2```)
* ```*``` for multiplication (i.e. ```2 * 5```)
* ```/``` for division (i.e. ```8 / 4```)
* ```**``` for power (i.e. ```2 ** 3```)
And more.

#### Difficulty

If you want to change the difficulty, you may use the ```diff``` option, with the number of the wanted difficulty. For example:
```
!w roll 4 diff 5
```
will roll 4 dice with a difficulty of 5. Note that a roll with a difficulty below 1 or above 10 is not permited.
You may also use calculations with this option, for example:
```
!w roll 3 * 3 diff 8 - 4
```
Will roll 9 dice with a difficulty of 4.

#### Proficiency

To roll a proficiency roll, just use the ```prof``` flag. For example:
```
!w roll 4 + 1 diff 7 prof
```
This can be added anywhere in the command as long as it comes after the ```roll``` command itself, like so:
```
!w roll 7 prof diff 2 * 2 
!w roll prof 3 diff 8
!w roll 6 diff prof 8
```

#### Flat Roll

You can also roll a roll with no rules that apply using the ```flat``` flag. This can be used for rolls like damage and soak. For example:
```
!w roll 13 diff 5 flat
```
will roll a flat roll of 13 dice at difficulty 5.
Like the ```prof``` flag, the ```flat``` flag can be added anywhere in the command.
