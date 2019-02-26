const Exchange = artifacts.require('MyExchange.sol');
const Token = artifacts.require('TestingToken.sol');
const { BN, constants, expectEvent, shouldFail } = require('openzeppelin-test-helpers');

contract ('Exchange', function (accounts) {

    const initialSupply = new BN(100);
    const transferAmount = new BN(50);
    const transferAmountFail = new BN(10000);
    const sender = accounts[0];

    beforeEach(async function () {
        this.exchange = await Exchange.new();
        this.token = await Token.new(initialSupply);
    });

    describe('depositToken', function() {
        describe('when the token address is the 0 address', function () {
            it('reverts', async function () {
                await shouldFail.reverting(this.exchange.depositToken(constants.ZERO_ADDRESS, transferAmount, { from: sender }));
            });
        });

        describe('when the token address is not the 0 address', function () {
            describe('when the token is not ERC20 compliant', function () {
                it('reverts', async function () {

                });
            });

            describe('when the token is ERC20 compliant', function () {
                describe('when the exchange has not been approved', function () {
                    it('reverts', async function () {
                        await shouldFail.reverting(this.exchange.depositToken(this.token.address, transferAmount, { from: sender }));
                    });
                });

                describe('when the exchange has been approved', function () {
                    describe('when the sender does not have enough tokens', function () {
                        it('reverts', async function () {
                            await this.token.approve(this.exchange.address, transferAmount, { from: sender });

                            await shouldFail.reverting(this.exchange.depositToken(this.token.address, transferAmountFail, { from: sender }));
                        });
                    });

                    describe('when the sender has enough tokens', function () {
                        it('deposits the requested amount', async function () {
                            await this.token.approve(this.exchange.address, transferAmount, { from: sender });

                            console.log(this.token.address);

                            await this.exchange.depositToken(this.token.address, transferAmount, { from: sender });

                            console.log(this.token.address);
                            (await this.token.balanceOf(sender)).should.be.bignumber.equal(transferAmount);

                            console.log(this.token.address);
                            (await this.token.balanceOf(this.exchange.address)).should.be.bignumber.equal(transferAmount);

                            console.log(this.token.address);
                            (await this.exchange.getUserBalance(this.token.address, { from: sender })).should.be.bignumber.equal(transferAmount);

                            //(await this.exchange.userBalanceForToken(this.token.address, sender)).should.be.bignumber.equal(transferAmount);
                        });

                        it('emits the deposit event', async function () {
                            await this.token.approve(this.exchange.address, transferAmount, { from: sender });

                            const { logs } = await this.exchange.depositToken(this.token.address, transferAmount, { from: sender });

                            expectEvent.inLogs(logs, 'LogDepositToken', {
                                _token: this.token.address,
                                _user: sender,
                                _amount: transferAmount,
                            });
                        });
                    });
                });
            });
        });
    });


    describe('withdrawToken', function () {
        describe('when the token address is the 0 address', function () {
            it('reverts', async function () {

            });
        });

        describe('when the token address is not the 0 address', function () {
            describe('when sender does not have enough tokens to withdraw', function () {
                it('reverts', async function () {

                });
            });

            describe('when the sender has enough tokens to withdraw', function () {
                it('transfers the tokens back to the sender', async function () {

                });

                it('emits the withdraw event', async function () {

                });
            });
        });
    });
});
